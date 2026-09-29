import { chromium, expect, test, type BrowserContext, type Page, type Worker } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';
import { resolve } from 'node:path';

const PAGE = (title: string) => `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title></head><body style="background:#fff;color:#111"><header><a href="/">${title}</a></header><main><h1>${title}</h1>` +
  `<div id="bar" style="background:#13233a;color:#fff;width:600px;height:40px">already dark</div>` +
  `<img id="photo" width="200" height="100" src="/photo.jpg"><img id="logo" width="120" height="40" src="/logo.svg"><img id="badge" width="120" height="40" src="/badge.svg">` +
  `<a id="hero" href="/h" style="display:block;position:relative;width:400px;height:200px"><img src="/hero.jpg" width="400" height="200" style="display:block"><span style="position:absolute;left:10px;bottom:10px;color:#fff">Headline on the photo</span></a>` +
  `<dialog id="modal">modal</dialog>` +
  `<input id="q" placeholder="Search or ask a question"><button id="gen">🍌 Create images</button><a id="ask" href="/x">Ask Question</a>` +
  `<div id="results" data-net19-hidden style="display:none"><a href="/1"><h3>One</h3></a><a href="/2"><h3>Two</h3></a><a href="/3"><h3>Three</h3></a></div>` +
  `<div id="menu" style="background:rgba(250,250,252,.95);width:300px;height:40px"><a id="faint" href="/y" style="color:#fff">Find a Store</a></div></main></body></html>`;
let context: BrowserContext, worker: Worker, extensionId: string, requests: string[], unexpected: string[];

test.beforeEach(async ({}, info) => {
  await mkdir(info.outputDir, { recursive: true }); requests = []; unexpected = [];
  const extension = resolve('.');
  context = await chromium.launchPersistentContext(resolve(info.outputDir, 'profile'), { channel: 'chromium', headless: true, viewport: { width: 1280, height: 800 },
    colorScheme: 'dark', args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`] });
  await context.route(/^https?:\/\//, async route => {
    const url = new URL(route.request().url());
    requests.push(url.href);
    if (/(^|\.)(youtube\.com|wikipedia\.org|reddit\.com|redditstatic\.com|example\.com)$/.test(url.hostname)) {
      const svg = { '/logo.svg': '#111', '/badge.svg': '#ffcc00' }[url.pathname];
      if (svg) await route.fulfill({ contentType: 'image/svg+xml', headers: { 'access-control-allow-origin': '*' }, body: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40"><rect width="120" height="40" fill="${svg}"/></svg>` });
      else await route.fulfill({ contentType: 'text/html', body: PAGE(url.hostname + url.pathname) });
      return;
    }
    unexpected.push(url.href); await route.abort();
  });
  worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker'); extensionId = new URL(worker.url()).host;
  await expect.poll(() => worker.evaluate(async () => globalThis.chrome?.scripting ? (await chrome.scripting.getRegisteredContentScripts()).length : 0)).toBeGreaterThan(15);
});
test.afterEach(async () => { await context.close(); expect(unexpected).toEqual([]); });

const scripts = () => worker.evaluate(async () => (await chrome.scripting.getRegisteredContentScripts()).map(s => s.id).sort());
const redirects = () => worker.evaluate(async () => (await chrome.declarativeNetRequest.getDynamicRules()).filter(r => r.action.redirect?.regexSubstitution).length);
async function open(url: string): Promise<Page> { const page = await context.newPage(); await page.goto(url); return page; }

test('a themed site is styled from its first paint; any other site is left alone and nothing is fetched', async () => {
  const themed = await open('https://www.youtube.com/');
  await expect(themed.locator('html')).toHaveAttribute('data-net19-mode', /^(light|dark)$/);
    expect(await themed.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--n19-page').trim())).toMatch(/^#/);
  const other = await open('https://www.example.com/page');
  await other.waitForTimeout(500);
  await expect(other.locator('html')).not.toHaveAttribute('data-net19-mode', /.*/);
  expect(await other.evaluate(() => document.querySelectorAll('style,link').length)).toBe(0);
  expect(await other.url()).toBe('https://www.example.com/page');
  expect(requests.filter(url => /archive\.org|archive\.(is|ph|today)/.test(url))).toEqual([]);
  expect(await scripts()).not.toContain('net19-start');
  await themed.evaluate(() => document.dispatchEvent(new CustomEvent('net19-fit-check')));
  await expect(themed.locator('html')).toHaveAttribute('data-n19-fit', /^fit/);
  expect(await fitRecords()).toEqual([]);
});

test('the device decides light or dark: a light site is recolored for a dark device, with pictures untouched, dark icons turned light and dark bars kept', async () => {
  const page = await open('https://www.youtube.com/');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-net19-recolor', 'dark');
  await expect(html).toHaveAttribute('data-net19-mode', 'dark');
  expect(await html.evaluate(el => getComputedStyle(el).filter)).toBe('none');
  const light = (selector: string, property: string) => page.locator(selector).evaluate((el, p) => {
    const m = getComputedStyle(el).getPropertyValue(p).match(/[\d.]+/g)!.map(Number);
    return (.2126 * m[0] + .7152 * m[1] + .0722 * m[2]) / 255;
  }, property);
  await expect.poll(() => light('body', 'background-color')).toBeLessThan(.2);
  await expect.poll(() => light('h1', 'color')).toBeGreaterThan(.6);
  expect(await light('#bar', 'background-color')).toBeLessThan(.2);
  expect(await page.locator('#photo').evaluate(el => getComputedStyle(el).filter)).toBe('none');
  await expect(page.locator('#logo')).toHaveAttribute('data-net19-glyph', '');
  await page.waitForTimeout(300);
  await expect(page.locator('#badge')).not.toHaveAttribute('data-net19-glyph', /.*/);
  expect(await page.locator('#hero span').evaluate(el => getComputedStyle(el).color)).toBe('rgb(255, 255, 255)');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(html).not.toHaveAttribute('data-net19-recolor', /.*/);
  await expect.poll(() => light('body', 'background-color')).toBeGreaterThan(.9);
});

test('pictures keep their exact colors when a page is recolored either way', async () => {
  const stripes = [[255, 255, 255], [128, 128, 128], [220, 40, 40], [20, 40, 160], [0, 0, 0]];
  const pixels = Buffer.alloc(200 * 40 * 3);
  for (let y = 0; y < 40; y++) for (let x = 0; x < 200; x++) pixels.set(stripes[Math.floor(x / 40)], (y * 200 + x) * 3);
  const png = await sharp(pixels, { raw: { width: 200, height: 40, channels: 3 } }).png().toBuffer();
  await context.route('https://www.youtube.com/swatch.png', route => route.fulfill({ contentType: 'image/png', body: png }));
  for (const [scheme, dark] of [['light', true], ['dark', false]] as const) {
    await context.route('https://www.youtube.com/colors', route => route.fulfill({ contentType: 'text/html',
      body: `<!doctype html><html${dark ? ' dark' : ''}><body style="margin:0;background:${dark ? '#0f0f0f' : '#fff'};color:${dark ? '#fff' : '#111'}"><p>${'Words '.repeat(40)}</p><img id="swatch" src="/swatch.png" width="200" height="40"></body></html>` }));
    const page = await context.newPage();
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('https://www.youtube.com/colors');
    await expect(page.locator('html')).toHaveAttribute('data-net19-recolor', scheme);
    await page.waitForTimeout(300);
    const shot = await page.locator('#swatch').screenshot();
    const { data, info } = await sharp(shot).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const scale = info.width / 200;
    stripes.forEach((want, i) => {
      const at = (Math.round(20 * scale) * info.width + Math.round((i * 40 + 20) * scale)) * 3;
      const got = [data[at], data[at + 1], data[at + 2]];
      expect(Math.max(...got.map((v, c) => Math.abs(v - want[c]))), `${scheme} device, stripe ${i}: ${got} vs ${want}`).toBeLessThanOrEqual(10);
    });
    await page.close();
    await context.unroute('https://www.youtube.com/colors');
  }
});

test('post-2019 features are hidden and unreadable text is given readable ink, on every themed site', async () => {
  const page = await context.newPage(); await page.emulateMedia({ colorScheme: 'light' }); await page.goto('https://www.youtube.com/');
  await expect(page.locator('#gen')).toBeHidden();
  await expect(page.locator('#ask')).toBeVisible();
  await expect(page.locator('#q')).toHaveAttribute('placeholder', 'Search');
  await expect(page.locator('#faint')).toHaveAttribute('data-net19-ink', 'dark');
  await expect(page.locator('#bar')).not.toHaveAttribute('data-net19-ink', /.*/);
  await expect(page.locator('#results')).toBeVisible();
});

test('Wikipedia opens in its legacy skin', async () => {
  const page = await open('https://en.wikipedia.org/wiki/Cat');
  expect(page.url()).toBe('https://en.wikipedia.org/wiki/Cat?useskin=vector');
});

test('Reddit keeps its own address signed in or out, with no account check, and gets the 2019 theme', async () => {
  await context.addCookies([{ name: 'reddit_session', value: 'fixture', domain: '.reddit.com', path: '/', secure: true, httpOnly: true }]);
  const page = await open('https://www.reddit.com/r/pics/?sort=top');
  await expect(page.locator('html')).toHaveAttribute('data-net19-mode', 'dark');
  expect(page.url()).toBe('https://www.reddit.com/r/pics/?sort=top');
  expect(await redirects()).toBe(0);
  expect(requests.filter(url => url.includes('/api/me.json'))).toEqual([]);
});

const REDESIGN = (broken: boolean) => `<!doctype html><html><head><meta charset="utf-8"><title>Redesign</title>` +
  (broken ? '<style>:root:not([data-n19-safe]) #feed{display:none}</style>' : '') +
  `</head><body><header><a href="/">Home</a></header><ytd-reel-shelf-renderer id="shorts"><a href="/shorts/x">Shorts</a></ytd-reel-shelf-renderer><main id="feed">${Array.from({ length: 24 }, (_, i) => `<p><a href="/v${i}">Video ${i}</a></p>`).join('')}</main></body></html>`;
const fitRecords = () => worker.evaluate(async () => Object.keys((await chrome.storage.local.get('net19-fit'))['net19-fit'] || {}));

test('a theme that stops fitting a redesigned page steps back to its safe layer, with post-2019 features still hidden, then recovers once it fits again', async () => {
  let broken = true;
  await context.route('https://www.youtube.com/redesign', route => route.fulfill({ contentType: 'text/html', body: REDESIGN(broken) }));
  const page = await open('https://www.youtube.com/redesign');
  const html = page.locator('html');
  const check = () => page.evaluate(() => document.dispatchEvent(new CustomEvent('net19-fit-check')));
  await check();
  await expect(html).toHaveAttribute('data-n19-fit', /^unfit/);
  await expect(html).toHaveAttribute('data-n19-safe', '');
  await expect(page.locator('#feed a').first()).toBeVisible();
  await expect(page.locator('#shorts')).toBeHidden();
  await expect(html).toHaveAttribute('data-net19-mode', /^(light|dark)$/);
  await expect.poll(fitRecords).toEqual(['youtube.com/redesign']);
  await expect.poll(scripts).toContain('net19-safe');
  await page.addInitScript(() => document.addEventListener('readystatechange', () => { if (document.readyState === 'interactive') (globalThis as any).safeEarly = document.documentElement.hasAttribute('data-n19-safe'); }));
  await page.reload();
  expect(await page.evaluate(() => (globalThis as any).safeEarly)).toBe(true);
  await expect(html).toHaveAttribute('data-n19-safe', '');
  broken = false;
  for (let load = 0; load < 2; load++) {
    await page.reload();
    await expect(html).toHaveAttribute('data-n19-safe', '');
    await check();
    await expect(html).toHaveAttribute('data-n19-fit', /^fit/);
  }
  await expect.poll(fitRecords).toEqual([]);
  await expect.poll(scripts).not.toContain('net19-safe');
  await page.reload();
  await check();
  await expect(html).toHaveAttribute('data-n19-fit', /^fit/);
  await expect(html).not.toHaveAttribute('data-n19-safe', /.*/);
});

test('on a phone-sized or touch-only screen, layout rules step aside while colors and hidden features stay; a wide window gets them back', async () => {
  const page = await context.newPage();
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('https://www.youtube.com/');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-n19-safe', '');
  await expect(html).toHaveAttribute('data-net19-mode', /^(light|dark)$/);
  await expect(page.locator('#gen')).toBeHidden();
  await page.evaluate(() => document.dispatchEvent(new CustomEvent('net19-fit-check')));
  await page.waitForTimeout(300);
  await expect(html).not.toHaveAttribute('data-n19-fit', /.*/);
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(html).not.toHaveAttribute('data-n19-safe', /.*/);
  expect(await fitRecords()).toEqual([]);
});

test('switching net19 off removes every script and rule', async () => {
  const site = await open('https://www.youtube.com/');
  await expect(site.locator('html')).toHaveAttribute('data-net19-mode', /.+/);
  const ui = await context.newPage(); await ui.goto(`chrome-extension://${extensionId}/popup.html`);
  await ui.getByLabel('net19', { exact: true }).uncheck();
  await expect.poll(scripts).toEqual([]);
  expect(await worker.evaluate(async () => (await chrome.declarativeNetRequest.getDynamicRules()).length)).toBe(0);
  await site.reload();
  await expect(site.locator('html')).not.toHaveAttribute('data-net19-mode', /.*/);
  expect((await open('https://en.wikipedia.org/wiki/Cat')).url()).toBe('https://en.wikipedia.org/wiki/Cat');
});

test('popup is two switches and a support link, nothing else', async ({}, info) => {
  const site = await open('https://www.youtube.com/watch?v=x');
  const tabId = await worker.evaluate(async () => (await chrome.tabs.query({ url: 'https://www.youtube.com/*' }))[0].id!);
  const popup = await context.newPage();
  await popup.addInitScript(({ tabId }) => { const api = (globalThis as any).chrome; if (api?.tabs) api.tabs.query = async () => [{ id: tabId, url: 'https://www.youtube.com/watch?v=x', incognito: false }]; }, { tabId });
  await popup.setViewportSize({ width: 260, height: 200 }); await popup.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(popup.locator('#site')).toHaveText('youtube.com');
  expect((await popup.locator('body').innerText()).split('\n').map(line => line.trim()).filter(Boolean)).toEqual(['net19', 'youtube.com', 'Support further development']);
  await expect(popup.locator('input[type=checkbox]')).toHaveCount(2); await expect(popup.locator('button, select, input[type=range]')).toHaveCount(0);
  await expect(popup.locator('a')).toHaveCount(1); await expect(popup.locator('a')).toHaveAttribute('href', 'https://buymeacoffee.com/0wtynrfutb');
  await popup.screenshot({ path: resolve(info.outputDir, 'popup.png') });
  await popup.locator('#site-switch').uncheck();
  await expect.poll(scripts).not.toContain('net19-theme-youtube');
  await expect.poll(scripts).toContain('net19-theme-google');
  await site.reload();
  await expect(site.locator('html')).not.toHaveAttribute('data-net19-mode', /.*/);
});

test('the popup shows no site switch on a site without a theme', async () => {
  const tabId = 1;
  const popup = await context.newPage();
  await popup.addInitScript(({ tabId }) => { const api = (globalThis as any).chrome; if (api?.tabs) api.tabs.query = async () => [{ id: tabId, url: 'https://www.example.com/', incognito: false }]; }, { tabId });
  await popup.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(popup.locator('#site-row')).toBeHidden();
  expect((await popup.locator('body').innerText()).split('\n').map(line => line.trim()).filter(Boolean)).toEqual(['net19', 'Support further development']);
});
