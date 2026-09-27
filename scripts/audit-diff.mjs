import { chromium } from '@playwright/test';
import { resolve } from 'node:path';
import { readFileSync, mkdirSync, appendFileSync } from 'node:fs';
const ALL = JSON.parse(readFileSync(new URL('./audit-urls.json', import.meta.url), 'utf8'));
const CHECKS = readFileSync(new URL('./page-checks.js', import.meta.url), 'utf8').replace(/^if \(typeof module[^\n]*$/m, '');
const pick = process.argv.slice(2), ext = resolve(process.env.EXT || '.'), OUT = resolve(process.env.OUT || 'test-results/diff');
const scheme = process.env.SCHEME || 'light';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const proxy = process.env.HTTPS_PROXY ? [`--proxy-server=${process.env.HTTPS_PROXY}`] : [];
mkdirSync(OUT, { recursive: true });
const key = item => item.what.replace(/\s+/g, ' ');
async function run(url, withExtension) {
  const ctx = await chromium.launchPersistentContext('', { channel: 'chromium', headless: true, viewport: { width: 1280, height: 860 }, colorScheme: scheme, userAgent: UA,
    args: [...proxy, ...(withExtension ? [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`] : [])] });
  await new Promise(r => setTimeout(r, 1500));
  const p = await ctx.newPage();
  let result = null;
  try {
    await p.goto(url, { waitUntil: 'load', timeout: 40000 }).catch(() => {});
    await p.waitForTimeout(4000);
    result = await p.evaluate(`(() => { ${CHECKS}; const r = net19PageChecks();
      const shown = e => e.checkVisibility ? e.checkVisibility() : e.getClientRects().length > 0;
      r.content = [...document.querySelectorAll('a[href] :is(h1, h2, h3), :is(h1, h2, h3) a[href], article')].filter(shown).length;
      r.text = (document.body.innerText || '').length; return r; })()`);
    if (withExtension) await p.screenshot({ path: `${OUT}/${new URL(url).hostname}.png` }).catch(() => {});
  } catch (e) { result = { error: e.message.slice(0, 80) }; }
  await ctx.close();
  return result;
}
const TARGETS = process.env.URLS ? Object.entries(JSON.parse(process.env.URLS)) : Object.entries(ALL).filter(([id]) => !pick.length || pick.includes(id));
for (const [id, url] of TARGETS) {
  const [before, after] = [await run(url, false), await run(url, true)];
  const added = {};
  if (before && after && !before.error && !after.error) {
    for (const k of ['covered', 'offcenter', 'textoffcenter', 'overlap', 'lowcontrast']) {
      const had = new Set(before[k].map(key));
      added[k] = after[k].filter(item => !had.has(key(item)));
    }
  }
  const lost = before && after && !before.error && !after.error && ((before.content >= 4 && after.content < before.content * .75) || after.text < before.text * .6)
    ? `content ${before.content} -> ${after.content}, text ${before.text} -> ${after.text}` : '';
  appendFileSync(`${OUT}/report.jsonl`, JSON.stringify({ id, url, scheme, added, lost, error: before?.error || after?.error }) + '\n');
  if (lost) console.log(`${id}: CONTENT LOST ${lost}`);
  console.log(`${id}: ` + (Object.keys(added).length ? Object.entries(added).map(([k, v]) => `${v.length} ${k}`).join(', ') : 'not compared (' + (before?.error || after?.error || 'no result') + ')'));
  for (const [k, list] of Object.entries(added)) for (const item of list.slice(0, 4)) console.log(`  ${k}: ${item.what.slice(0, 70)} | ${item.detail.slice(0, 70)}`);
}
