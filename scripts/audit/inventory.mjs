import { chromium } from '@playwright/test';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

const ALL = JSON.parse(readFileSync(new URL('./urls.json', import.meta.url), 'utf8'));
const [id] = process.argv.slice(2);
if (!id) { console.error('usage: node scripts/audit/inventory.mjs <theme id>   (URLS=\'{"page":"https://…"}\' for more pages)'); process.exit(2); }
const EXT = resolve(process.env.EXT || '.');
const OUT = resolve(process.env.OUT || `test-results/inventory/${id}`);
const SCHEME = process.env.SCHEME || 'light';
const PAGES = process.env.URLS ? JSON.parse(process.env.URLS) : { start: ALL[id] };
const EVIDENCE_FILE = resolve(`evidence/${id}.json`);
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const proxy = process.env.HTTPS_PROXY ? [`--proxy-server=${process.env.HTTPS_PROXY}`] : [];

function collectFeatures() {
  const SECTION = 'header, nav, main, aside, footer, section, article, dialog, form, [role=banner], [role=navigation], [role=main], [role=complementary], [role=contentinfo], [role=region], [role=search], [role=dialog], [role=tablist], [role=toolbar], [role=feed], [role=menubar]';
  const HEADING = 'h1, h2, h3, h4, [role=heading]';
  const CONTROL = 'button, a[href], [role=button], [role=tab], [role=link], [role=menuitem], input:not([type=hidden]), textarea, select';
  const shown = el => {
    if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false;
    const r = el.getBoundingClientRect();
    return r.width >= 8 && r.height >= 8 && r.bottom > 0 && r.right > 0 && r.left < innerWidth;
  };
  const clean = text => String(text || '').replace(/\s+/g, ' ').trim().slice(0, 70);
  const labelOf = el => clean(el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('placeholder') || el.querySelector(HEADING)?.textContent || el.textContent);
  const box = el => { const r = el.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) }; };
  const features = [];
  const seen = new Set();
  const add = (kind, el, label) => {
    label = clean(label);
    if (!label || label.length < 2) return;
    const key = `${kind}|${label.toLowerCase()}`;
    if (seen.has(key)) return;
    seen.add(key);
    features.push({ kind, label, tag: el.tagName.toLowerCase(), role: el.getAttribute('role') || '', box: box(el) });
  };
  const repeats = new WeakMap();
  const isRepeated = n => {
    if (repeats.has(n)) return repeats.get(n);
    const parent = n.parentElement;
    let twins = 0;
    if (parent) for (const c of parent.children) { if (c.tagName === n.tagName && c.className === n.className && ++twins >= 3) break; }
    const result = twins >= 3;
    if (parent) for (const c of parent.children) if (c.tagName === n.tagName && c.className === n.className) repeats.set(c, result);
    repeats.set(n, result);
    return result;
  };
  const repeatedItem = el => {
    for (let n = el; n && n !== document.body; n = n.parentElement) if (n.parentElement && isRepeated(n)) return n;
    return null;
  };
  const storyLink = el => {
    const a = el.closest('a[href]');
    if (!a) return false;
    try {
      const url = new URL(a.href, location.href);
      const parts = url.pathname.split('/').filter(Boolean);
      const slug = parts[parts.length - 1] || '';
      return parts.length >= 3 || (slug.match(/-/g) || []).length >= 3 || /\d{5,}/.test(url.pathname + url.search);
    } catch { return false; }
  };
  const itemName = item => `repeated ${item.tagName.toLowerCase()}${item.getAttribute('role') ? ' role=' + item.getAttribute('role') : ''}`;
  const region = el => el.closest('header, nav, aside, footer, [role=banner], [role=navigation], [role=complementary], [role=contentinfo], [role=toolbar], [role=tablist], [role=menubar]');
  for (const el of document.querySelectorAll(SECTION)) {
    if (!shown(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 120 || r.height < 30) continue;
    const heading = [...el.querySelectorAll(HEADING)].find(h => shown(h) && !repeatedItem(h));
    add('section', el, el.getAttribute('aria-label') || heading?.textContent || `${el.getAttribute('role') || el.tagName.toLowerCase()} area`);
  }
  for (const el of document.querySelectorAll(HEADING)) {
    if (!shown(el)) continue;
    const item = repeatedItem(el);
    if (item) add('content', item, itemName(item)); else add('heading', el, el.textContent);
  }
  const inContent = el => el.closest('article, [role=article], [role=feed] > *, [role=listitem], li') || repeatedItem(el);
  const contentLabels = new Map();
  for (const el of document.querySelectorAll(CONTROL)) {
    if (!shown(el) || region(el) || !inContent(el)) continue;
    const label = labelOf(el);
    if (label) contentLabels.set(label.toLowerCase(), (contentLabels.get(label.toLowerCase()) || 0) + 1);
  }
  for (const el of document.querySelectorAll(CONTROL)) {
    if (!shown(el)) continue;
    const label = labelOf(el) || el.querySelector('img')?.alt || '';
    if (region(el)) { add('control', el, label); continue; }
    if (inContent(el)) { if ((contentLabels.get(label.toLowerCase()) || 0) >= 2 && label.length <= 30) add('item control', el, label); continue; }
    if (storyLink(el) && !region(el)) continue;
    if (label.length <= 30) add('control', el, label);
  }
  for (const el of document.querySelectorAll('[class*="badge" i], [class*="chip" i], [class*="pill" i], [class*="summary" i]')) {
    if (!shown(el) || el.closest(CONTROL) || repeatedItem(el) || el.closest('article, [role=article]')) continue;
    const label = clean(el.textContent);
    if (label.length <= 30) add('badge', el, label);
  }
  for (const el of document.querySelectorAll('[role=tab], [role=menuitem], [role=option][aria-selected]')) if (shown(el)) add('tab', el, labelOf(el));
  for (const el of document.querySelectorAll('input:not([type=hidden]), textarea')) if (shown(el)) add('field', el, labelOf(el) || el.name);
  return features;
}

function loadEvidence() {
  if (!existsSync(EVIDENCE_FILE)) return { sources: [], features: [] };
  const data = JSON.parse(readFileSync(EVIDENCE_FILE, 'utf8'));
  data.features = (data.features || []).map(f => ({ ...f, pattern: new RegExp(f.match, 'i') }));
  return data;
}

const evidence = loadEvidence();
mkdirSync(OUT, { recursive: true });
const context = await chromium.launchPersistentContext('', { channel: 'chromium', headless: true, viewport: { width: 1280, height: 860 }, colorScheme: SCHEME, userAgent: UA,
  args: [...proxy, `--disable-extensions-except=${EXT}`, `--load-extension=${EXT}`] });
await new Promise(r => setTimeout(r, 1500));
const report = [];
let problems = 0;
for (const [name, url] of Object.entries(PAGES)) {
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'load', timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(4000);
  for (let y = 0; y < 4; y++) { await page.mouse.wheel(0, 800); await page.waitForTimeout(700); }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(800);
  const features = await page.evaluate(collectFeatures).catch(() => []);
  const shot = await page.screenshot({ fullPage: true }).catch(() => null);
  const meta = shot ? await sharp(shot).metadata() : null;
  report.push(`## ${name}: ${url}\n`);
  for (const [i, f] of features.entries()) {
    const known = evidence.features.find(e => e.pattern.test(f.label));
    const verdict = !known ? 'UNVERIFIED' : known.in2019 ? '2019' : /^kept/i.test(known.action || '') ? 'KEPT' : 'POST-2019 STILL SHOWN';
    if (verdict !== '2019' && verdict !== 'KEPT') problems++;
    let crop = '';
    if (shot && verdict !== '2019' && verdict !== 'KEPT' && f.box.w > 2 && f.box.h > 2) {
      const left = Math.max(0, f.box.x), top = Math.max(0, f.box.y);
      const width = Math.min(meta.width - left, f.box.w), height = Math.min(meta.height - top, Math.min(f.box.h, 1200));
      if (width > 2 && height > 2) { crop = `${OUT}/${name}-${i}.png`; await sharp(shot).extract({ left, top, width, height }).toFile(crop).catch(() => { crop = ''; }); }
    }
    report.push(`- [${verdict}] ${f.kind} "${f.label}" (${f.tag}${f.role ? ' role=' + f.role : ''}) at ${f.box.x},${f.box.y} ${f.box.w}x${f.box.h}${known?.evidence ? ` — ${[].concat(known.evidence).join(', ')}` : ''}${crop ? ` — ${crop}` : ''}`);
  }
  if (shot) writeFileSync(`${OUT}/${name}-full.png`, shot);
  report.push('');
  await page.close();
}
await Promise.race([context.close(), new Promise(r => setTimeout(r, 5000))]).catch(() => {});
writeFileSync(`${OUT}/inventory.md`, `# ${id} (${SCHEME})\n\nEvidence file: ${existsSync(EVIDENCE_FILE) ? EVIDENCE_FILE : 'missing'}\n\n${report.join('\n')}`);
console.log(`${id}: ${problems} feature(s) not backed by 2019 evidence or still showing though post-2019. Report: ${OUT}/inventory.md`);
process.exit(problems ? 1 : 0);
