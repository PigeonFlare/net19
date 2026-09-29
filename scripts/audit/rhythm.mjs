import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../../', import.meta.url);
const URLS = JSON.parse(readFileSync(new URL('scripts/audit/urls.json', root), 'utf8'));
const CHECKS = readFileSync(new URL('scripts/audit/page-checks.js', root), 'utf8').replace(/^if \(typeof module[^\n]*$/m, '');
const EXT = process.env.EXT || root.pathname.replace(/\/$/, '');
const SCHEME = process.env.SCHEME || 'light';
const OUT = new URL(`artifacts/audit/rhythm-${SCHEME}/`, root);
const args = process.argv.slice(2);
const ids = args.length ? args : Object.keys(URLS);
const KINDS = { patch: 'Neutral patch that does not match what is behind it', tight: 'Repeated items padded above but not below', loose: 'Large empty band inside a repeated item', gap: 'Large empty band inside a painted box' };
mkdirSync(OUT, { recursive: true });

const context = await chromium.launchPersistentContext('', { channel: 'chromium', headless: true, viewport: { width: 1280, height: 900 }, colorScheme: SCHEME,
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
  args: [...(process.env.HTTPS_PROXY ? [`--proxy-server=${process.env.HTTPS_PROXY}`] : []), `--disable-extensions-except=${EXT}`, `--load-extension=${EXT}`] });
let worker = context.serviceWorkers().find(w => w.url().endsWith('/background.js'));
while (!worker) { const w = await context.waitForEvent('serviceworker'); if (w.url().endsWith('/background.js')) worker = w; }
for (let t = 0; t < 100; t++) { if (await worker.evaluate(async () => (await chrome.scripting.getRegisteredContentScripts()).length).catch(() => 0) >= 10) break; await new Promise(r => setTimeout(r, 200)); }

const rows = [];
let next = 0;
await Promise.all([1, 2, 3].map(async () => {
  while (next < ids.length) {
    const id = ids[next++];
    let page;
    try {
      page = await context.newPage();
      await page.goto(URLS[id] || id, { waitUntil: 'load', timeout: 35000 }).catch(() => {});
      await page.waitForTimeout(4500);
      const found = await page.evaluate(`${CHECKS}; (() => { const a = net19Rhythm(), b = net19Rows(); return { ...a, gap: b.gap }; })()`);
      const size = await page.evaluate(() => ({ w: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight }));
      let n = 0;
      for (const [kind, list] of Object.entries(found)) for (const item of list.slice(0, 3)) {
        const x = Math.max(0, item.x - 24), y = Math.max(0, item.y - 40), w = Math.min(size.w - x, Math.max(item.w + 48, 320)), h = Math.min(size.h - y, Math.min(Math.max(item.h + 80, 120), 500));
        if (w < 10 || h < 10) continue;
        const file = `${id.replace(/[^a-z0-9]+/gi, '_').slice(0, 40)}-${kind}-${n++}.png`;
        await page.screenshot({ path: new URL(file, OUT).pathname, clip: { x, y, width: w, height: h }, fullPage: true, timeout: 15000 }).catch(() => {});
        rows.push({ id, kind, file, what: item.what, detail: item.detail });
      }
      console.log(id, Object.entries(found).map(([k, v]) => `${k}:${v.length}`).join(' '));
    } catch (error) { console.log(id, 'failed', String(error).slice(0, 80)); }
    finally { await page?.close().catch(() => {}); }
  }
}));
await context.close();
const escape = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
writeFileSync(new URL('index.html', OUT), `<!doctype html><meta charset="utf-8"><title>net19 rhythm (${SCHEME})</title>
<style>body{font:14px system-ui;margin:24px;background:#f4f4f4}figure{display:inline-block;vertical-align:top;margin:0 16px 24px 0;background:#fff;padding:8px;border:1px solid #ddd;max-width:560px}img{max-width:540px;display:block;outline:1px solid #eee}figcaption{margin-top:6px;font-size:12px;color:#333}b{color:#b00}</style>
<h1>net19 rhythm review (${SCHEME})</h1><p>Each crop is a spot where spacing or a patch of color looks off. Compare it with the site's 2019 evidence before changing anything.</p>
${rows.map(r => `<figure><img src="${r.file}" loading="lazy"><figcaption><b>${escape(r.id)}</b> · ${escape(KINDS[r.kind])}<br>${escape(r.what)}<br>${escape(r.detail)}</figcaption></figure>`).join('\n')}`);
writeFileSync(new URL('findings.json', OUT), JSON.stringify(rows, null, 1));
console.log(`Wrote ${new URL('index.html', OUT).pathname} (${rows.length} crops)`);
