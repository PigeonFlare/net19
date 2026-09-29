import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../../', import.meta.url);
const URLS = JSON.parse(readFileSync(new URL('scripts/audit/urls.json', root), 'utf8'));
const CHECKS = readFileSync(new URL('scripts/audit/page-checks.js', root), 'utf8').replace(/^if \(typeof module[^\n]*$/m, '');
const EXT = process.env.EXT || root.pathname.replace(/\/$/, '');
const SCHEME = process.env.SCHEME || 'light';
const OUT = new URL(process.env.OUT ? `${process.env.OUT.replace(/\/?$/, "/")}` : `artifacts/audit/rhythm-${SCHEME}/`, process.env.OUT ? "file:///" : root);
const args = process.argv.slice(2);
const ids = args.length ? args : Object.keys(URLS);
const KINDS = { faint: 'Text that reads poorly against what is actually drawn behind it', patch: 'Neutral patch that does not match what is behind it', tight: 'Repeated items padded above but not below', loose: 'Large empty band inside a repeated item', gap: 'Large empty band inside a painted box' };
mkdirSync(OUT, { recursive: true });

const context = await chromium.launchPersistentContext('', { channel: 'chromium', headless: true, viewport: { width: 1280, height: 900 }, colorScheme: SCHEME,
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
  args: [...(process.env.HTTPS_PROXY ? [`--proxy-server=${process.env.HTTPS_PROXY}`] : []), `--disable-extensions-except=${EXT}`, `--load-extension=${EXT}`] });
let worker = context.serviceWorkers().find(w => w.url().endsWith('/background.js'));
while (!worker) { const w = await context.waitForEvent('serviceworker'); if (w.url().endsWith('/background.js')) worker = w; }
for (let t = 0; t < 100; t++) { if (await worker.evaluate(async () => (await chrome.scripting.getRegisteredContentScripts()).length).catch(() => 0) >= 10) break; await new Promise(r => setTimeout(r, 200)); }

const TEXT_LINES = () => {
  const out = [], seen = new Set();
  const hidden = e => { for (let n = e, i = 0; n && n.nodeType === 1; n = n.parentElement || n.parentNode?.host, i++) { const c = getComputedStyle(n); if (c.display === 'none' || c.visibility === 'hidden' || +c.opacity < .05) return true; if (i < 4 && ((c.clip && c.clip !== 'auto') || /inset\(50%|circle\(0/.test(c.clipPath))) return true; } return false; };
  const walk = root => {
    const t = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = t.nextNode(); n && out.length < 700; n = t.nextNode()) {
      const text = n.nodeValue.replace(/\s+/g, ' ').trim();
      if (text.length < 2 || !n.parentElement || n.parentElement.closest('script, style, noscript, svg') || hidden(n.parentElement)) continue;
      const range = document.createRange(); range.selectNodeContents(n);
      for (const q of range.getClientRects()) {
        if (q.width < 10 || q.height < 8 || q.height > 60 || q.top < 0 || q.left < 0 || q.bottom > innerHeight || q.right > innerWidth) continue;
        const key = Math.round(q.left) + ',' + Math.round(q.top);
        if (seen.has(key)) continue; seen.add(key);
        const e = n.parentElement;
        const hit = document.elementFromPoint(q.left + Math.min(q.width / 2, 20), q.top + q.height / 2);
        if (!hit || !(hit === e || e.contains(hit) || hit.contains(e) || (hit.shadowRoot && hit.shadowRoot.contains(e)) || e.getRootNode().host === hit)) continue;
        out.push({ x: q.left, y: q.top, w: q.width, h: q.height, size: parseFloat(getComputedStyle(e).fontSize), what: `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''} "${text.slice(0, 30)}"` });
      }
    }
    for (const e of root.querySelectorAll('*')) if (e.shadowRoot) walk(e.shadowRoot);
  };
  walk(document.body);
  return out;
};
const luminance = (r, g, b) => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
async function faint(page) {
  const lines = await page.evaluate(`(${TEXT_LINES})()`).catch(() => []);
  if (!lines.length) return [];
  const shot = await page.screenshot({ type: 'png', timeout: 15000 }).catch(() => null);
  if (!shot) return [];
  const { data, info } = await sharp(shot).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const scale = info.width / (await page.evaluate(() => innerWidth));
  const lum = (x, y) => { x = Math.min(info.width - 1, Math.max(0, Math.round(x * scale))); y = Math.min(info.height - 1, Math.max(0, Math.round(y * scale))); const i = (y * info.width + x) * 3; return luminance(data[i], data[i + 1], data[i + 2]); };
  const found = [];
  for (const q of lines) {
    const ring = [];
    for (let x = q.x - 3; x <= q.x + q.w + 3; x += 2) { ring.push(lum(x, q.y - 3), lum(x, q.y + q.h + 2)); }
    for (let y = q.y; y <= q.y + q.h; y += 2) { ring.push(lum(q.x - 4, y), lum(q.x + q.w + 3, y)); }
    ring.sort((a, b) => a - b);
    const bg = ring[Math.floor(ring.length / 2)];
    const spread = ring[Math.floor(ring.length * .9)] - ring[Math.floor(ring.length * .1)];
    const inside = [];
    for (let y = q.y + q.h * .2; y <= q.y + q.h * .85; y += 1 / scale) for (let x = q.x; x <= q.x + q.w; x += 1 / scale) inside.push(lum(x, y));
    const far = inside.map(v => Math.abs(v - bg)).sort((a, b) => b - a);
    const pick = far[Math.min(far.length - 1, Math.floor(inside.length * .02))];
    const ink = inside.find(v => Math.abs(Math.abs(v - bg) - pick) < 1e-9) ?? bg;
    const ratio = (Math.max(ink, bg) + .05) / (Math.min(ink, bg) + .05);
    const need = q.size >= 18 ? 2.2 : 2.8;
    if (ratio < need) found.push({ what: q.what, detail: `reads at ${ratio.toFixed(2)}:1 against what is drawn behind it${spread > .2 ? ' (busy background)' : ''}`, x: Math.round(q.x), y: Math.round(q.y), w: Math.round(q.w), h: Math.round(q.h), ratio });
  }
  return found.sort((a, b) => a.ratio - b.ratio).slice(0, 12);
}

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
      found.faint = await faint(page);
      let n = 0;
      for (const [kind, list] of Object.entries(found)) for (const item of list.slice(0, kind === 'faint' ? 6 : 3)) {
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
