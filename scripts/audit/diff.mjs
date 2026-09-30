import { chromium } from '@playwright/test';
import { resolve } from 'node:path';
import { readFileSync, mkdirSync, appendFileSync } from 'node:fs';
const ALL = JSON.parse(readFileSync(new URL('./urls.json', import.meta.url), 'utf8'));
const CHECKS = readFileSync(new URL('./page-checks.js', import.meta.url), 'utf8').replace(/^if \(typeof module[^\n]*$/m, '');
const pick = process.argv.slice(2), ext = resolve(process.env.EXT || '.'), OUT = resolve(process.env.OUT || 'test-results/diff');
const scheme = process.env.SCHEME || 'light';
const WIDTHS = (process.env.WIDTHS || '1280,1000').split(',').map(Number);
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const proxy = process.env.HTTPS_PROXY ? [`--proxy-server=${process.env.HTTPS_PROXY}`] : [];
mkdirSync(OUT, { recursive: true });
const key = item => item.what.replace(/\s+/g, ' ');
async function run(url, withExtension, width) {
  const ctx = await chromium.launchPersistentContext('', { channel: 'chromium', headless: true, viewport: { width, height: 860 }, colorScheme: scheme, userAgent: UA,
    args: [...proxy, ...(withExtension ? [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`] : [])] });
  await new Promise(r => setTimeout(r, 1500));
  const p = await ctx.newPage();
  let result = null;
  try {
    await p.goto(url, { waitUntil: 'load', timeout: 40000 }).catch(() => {});
    await p.waitForTimeout(+(process.env.WAIT || 4000));
    result = await p.evaluate(`(() => { ${CHECKS}; const r = net19PageChecks(); Object.assign(r, net19Content()); return r; })()`);
    if (withExtension) await p.screenshot({ path: `${OUT}/${new URL(url).hostname}${width === WIDTHS[0] ? '' : '-' + width}.png` }).catch(() => {});
  } catch (e) { result = { failed: e.message.slice(0, 80) }; }
  await ctx.close();
  return result;
}
const TARGETS = process.env.URLS ? Object.entries(JSON.parse(process.env.URLS)) : Object.entries(ALL).filter(([id]) => !pick.length || pick.includes(id));
for (const [id, url] of TARGETS) for (const width of WIDTHS) {
  const [before, after] = [await run(url, false, width), await run(url, true, width)];
  const added = {};
  if (before && after && !before.failed && !after.failed) {
    for (const k of ['covered', 'offcenter', 'textoffcenter', 'overlap', 'lowcontrast', 'dim', 'cropped', 'collide', 'effects', 'clipline', 'rowwrap', 'rowalign', 'spill', 'iconovertext', 'gap', 'btnsize', 'scrollreach', 'badgealign', 'loose']) {
      const had = new Set((before[k] || []).map(key));
      added[k] = (after[k] || []).filter(item => !had.has(key(item)));
    }
    added.contentlost = [];
    if (after.text < before.text * .6) added.contentlost.push({ what: 'visible text', detail: `${before.text} -> ${after.text} characters (${Math.round(100 * after.text / before.text)}%)` });
    if (before.items >= 5 && after.items < before.items * .6) added.contentlost.push({ what: 'result and item links', detail: `${before.items} -> ${after.items} (${Math.round(100 * after.items / before.items)}%)` });
  }
  appendFileSync(`${OUT}/report.jsonl`, JSON.stringify({ id, url, scheme, width, added, error: before?.failed || after?.failed, checkerror: [before?.error, after?.error].filter(Boolean).join(' | ') || undefined }) + '\n');
  if (added.contentlost?.length) console.log(`${id} ${width}: CONTENT LOST ${added.contentlost.map(c => `${c.what} ${c.detail}`).join('; ')}`);
  console.log(`${id} ${width}: ` + (Object.keys(added).length ? Object.entries(added).map(([k, v]) => `${v.length} ${k}`).join(', ') : 'not compared (' + (before?.failed || after?.failed || 'no result') + ')'));
  for (const [side, r] of [['without', before], ['with', after]]) if (r?.error) console.log(`  check error ${side} net19: ${r.error.slice(0, 160)}`);
  for (const [k, list] of Object.entries(added)) for (const item of list.slice(0, 4)) console.log(`  ${k}: ${item.what.slice(0, 70)} | ${item.detail.slice(0, 70)}`);
}
