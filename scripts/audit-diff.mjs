// Theme-caused layout problems: runs the page checks (page-checks.js) on each site's start page twice, without net19
// and with it, and reports only what net19 introduced — controls it covers, icons and text it moves off center,
// text it makes overlap. What the site does on its own (a cookie banner over the page, a carousel) is left out.
// usage: npm run build && node scripts/audit-diff.mjs [id ...]   (SCHEME=light|dark, OUT=test-results/diff)
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
// Items are compared by what they are, not where: a theme may move things around without breaking them.
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
    result = await p.evaluate(`(() => { ${CHECKS}; return net19PageChecks(); })()`);
    if (withExtension) await p.screenshot({ path: `${OUT}/${new URL(url).hostname}.png` }).catch(() => {});
  } catch (e) { result = { error: e.message.slice(0, 80) }; }
  await ctx.close();
  return result;
}
for (const [id, url] of Object.entries(ALL).filter(([id]) => !pick.length || pick.includes(id))) {
  const [before, after] = [await run(url, false), await run(url, true)];
  const added = {};
  if (before && after && !before.error && !after.error) {
    for (const k of ['covered', 'offcenter', 'textoffcenter', 'overlap']) {
      const had = new Set(before[k].map(key));
      added[k] = after[k].filter(item => !had.has(key(item)));
    }
  }
  appendFileSync(`${OUT}/report.jsonl`, JSON.stringify({ id, url, scheme, added, error: before?.error || after?.error }) + '\n');
  console.log(`${id}: ` + (Object.keys(added).length ? Object.entries(added).map(([k, v]) => `${v.length} ${k}`).join(', ') : 'not compared (' + (before?.error || after?.error || 'no result') + ')'));
  for (const [k, list] of Object.entries(added)) for (const item of list.slice(0, 4)) console.log(`  ${k}: ${item.what.slice(0, 70)} | ${item.detail.slice(0, 70)}`);
}
