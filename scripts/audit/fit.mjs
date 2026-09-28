import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ALL = JSON.parse(readFileSync(new URL('./urls.json', import.meta.url), 'utf8'));
const pick = process.argv.slice(2);
const EXT = resolve(process.env.EXT || '.');
const OUT = resolve(process.env.OUT || 'test-results/fit');
const SCHEME = process.env.SCHEME || 'light';
const SHOTS = !!process.env.SHOTS;
const PARALLEL = Number(process.env.PARALLEL || 3);
const SETTLE_MS = Number(process.env.SETTLE_MS || 5000);
const CHECK_TIMEOUT_MS = 60000 + SETTLE_MS;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const proxy = process.env.HTTPS_PROXY ? [`--proxy-server=${process.env.HTTPS_PROXY}`] : [];
const BLOCKED = /captcha|access denied|attention required|are you a robot|verify you are human|unusual traffic|request blocked|not available in your (?:country|region)|just a moment/i;

mkdirSync(OUT, { recursive: true });
const targets = process.env.URLS ? Object.entries(JSON.parse(process.env.URLS)) : Object.entries(ALL).filter(([id]) => !pick.length || pick.includes(id));
let browser = null;
async function launch() {
  const context = await chromium.launchPersistentContext('', { channel: 'chromium', headless: true, viewport: { width: 1280, height: 860 }, colorScheme: SCHEME, userAgent: UA,
    args: [...proxy, `--disable-extensions-except=${EXT}`, `--load-extension=${EXT}`] });
  const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker');
  await worker.evaluate(async () => { while ((await chrome.scripting.getRegisteredContentScripts()).length < 10) await new Promise(r => setTimeout(r, 200)); });
  context.on('close', () => { if (browser?.context === context) browser = null; });
  return context;
}
const openContext = () => {
  browser ??= { context: null, ready: launch().then(context => (browser.context = context)) };
  return browser.ready;
};

async function check(id, url, retry = true) {
  let page;
  try { page = await (await openContext()).newPage(); } catch (error) { browser = null; return retry ? check(id, url, false) : { id, url, verdict: 'error', error: `browser did not start: ${String(error.message).slice(0, 80)}` }; }
  try {
    const response = await page.goto(url, { waitUntil: 'load', timeout: 40000 }).catch(() => null);
    await page.waitForTimeout(SETTLE_MS);
    const state = await page.evaluate(async () => {
      const root = document.documentElement;
      document.dispatchEvent(new CustomEvent('net19-fit-check'));
      await new Promise(r => setTimeout(r, 0));
      return { themed: root.hasAttribute('data-net19-mode'), fit: root.getAttribute('data-n19-fit') || '',
        title: document.title, text: (document.body?.innerText || '').length, finalUrl: location.href };
    });
    const status = response?.status() ?? 0;
    const elsewhere = new URL(state.finalUrl).hostname.split('.').slice(-2).join('.') !== new URL(url).hostname.split('.').slice(-2).join('.');
    const blocked = state.finalUrl.startsWith('chrome-error:') || (status >= 400 && state.text < 2000) || BLOCKED.test(state.title) || state.text < 40 || (elsewhere && !state.themed);
    const verdict = blocked ? 'blocked' : !state.themed ? 'unthemed' : state.fit.split(' ')[0] || 'unchecked';
    if (SHOTS) {
      await page.evaluate(() => document.documentElement.removeAttribute('data-n19-safe'));
      await page.screenshot({ path: `${OUT}/${id}-full.png` }).catch(() => {});
      await page.evaluate(() => document.documentElement.setAttribute('data-n19-safe', ''));
      await page.screenshot({ path: `${OUT}/${id}-safe.png` }).catch(() => {});
    }
    return { id, url, verdict, status, ...state };
  } catch (error) {
    if (/crashed|closed/i.test(error.message)) {
      const broken = page.context();
      if (browser?.context === broken) browser = null;
      await broken.close().catch(() => {});
      if (retry) return check(id, url, false);
    }
    return { id, url, verdict: 'error', error: String(error.message).slice(0, 120) };
  } finally {
    await page.close().catch(() => {});
  }
}

const results = [];
const queue = [...targets];
await Promise.all(Array.from({ length: PARALLEL }, async () => {
  for (let next; (next = queue.shift());) {
    const result = await Promise.race([check(...next), new Promise(done => setTimeout(() => done({ id: next[0], url: next[1], verdict: 'error', error: 'timed out' }), CHECK_TIMEOUT_MS))]);
    if (result.error === 'timed out') { const stuck = browser?.context; browser = null; await stuck?.close().catch(() => {}); }
    results.push(result);
    console.log(`${result.verdict.padEnd(9)} ${result.id.padEnd(16)} ${result.fit || result.error || ''}`);
  }
}));
await Promise.race([browser?.context?.close(), new Promise(done => setTimeout(done, 5000))]).catch(() => {});

results.sort((a, b) => a.id.localeCompare(b.id));
writeFileSync(`${OUT}/fit.json`, JSON.stringify(results, null, 1));
const broken = results.filter(r => r.verdict === 'unfit' || r.verdict === 'unthemed');
const unreachable = results.filter(r => r.verdict === 'blocked' || r.verdict === 'error');
const line = r => `- **${r.id}** ${r.url} (${r.verdict}${r.fit ? `: ${r.fit}` : ''}${r.finalUrl && r.finalUrl !== r.url ? `, landed on ${r.finalUrl}` : ''})`;
writeFileSync(`${OUT}/report.md`, [
  `Checked ${results.length} themed sites in ${SCHEME} mode.`,
  '',
  broken.length ? `### Stopped fitting (${broken.length})\n\nnet19 falls back to the safe 2019 layer on these until the theme is updated.\n\n${broken.map(line).join('\n')}` : '### Every reachable theme still fits',
  '',
  unreachable.length ? `<details><summary>Could not be checked from GitHub's servers (${unreachable.length})</summary>\n\n${unreachable.map(line).join('\n')}\n</details>` : '',
].join('\n'));
writeFileSync(`${OUT}/broken.txt`, broken.map(r => r.id).join('\n'));
console.log(`\n${results.length} checked: ${results.filter(r => r.verdict === 'fit' || r.verdict === 'unsure').length} fit, ${broken.length} broken, ${unreachable.length} unreachable`);
process.exit(0);
