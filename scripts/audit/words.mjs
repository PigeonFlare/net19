import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../../', import.meta.url);
const EXT = root.pathname.replace(/\/$/, '');
const URLS = JSON.parse(readFileSync(new URL('scripts/audit/urls.json', root), 'utf8'));
const LANGS = (process.env.LANGS || 'es,fr,pt-BR,it,ja,zh-CN,ko,ru,hi,ar').split(',');
const args = process.argv.slice(2);
const WRITE = args.includes('--write');
const ids = args.filter(a => !a.startsWith('--'));
const list = ids.length ? ids.filter(id => URLS[id]) : Object.keys(URLS);
const REPORT = new URL('artifacts/audit/words.json', root);
const short = lang => lang.split('-')[0];
const STEAM = { es: 'spanish', fr: 'french', pt: 'brazilian', it: 'italian', ja: 'japanese', zh: 'schinese', ko: 'koreana', ru: 'russian', hi: 'english', ar: 'arabic' };
const localized = (id, lang) => {
  const url = new URL(URLS[id]);
  if (/(^|\.)google\.com$|(^|\.)youtube\.com$/.test(url.hostname)) url.searchParams.set('hl', lang);
  else if (url.hostname.endsWith('bing.com')) url.searchParams.set('setlang', lang);
  else if (url.hostname === 'store.steampowered.com') url.searchParams.set('l', STEAM[short(lang)]);
  else if (url.hostname.endsWith('whatsapp.com')) url.searchParams.set('lang', short(lang));
  else if (url.hostname === 'telegram.org') url.searchParams.set('setln', short(lang));
  else if (url.hostname === 'en.wikipedia.org') return null;
  return url.href;
};

const STABLE = `const stable = el => {
    let part = el.localName;
    if (el.id && /^[A-Za-z][\\w-]{1,40}$/.test(el.id) && !/\\d{3}/.test(el.id)) return part + '#' + CSS.escape(el.id);
    for (const a of ['data-testid', 'data-test', 'role', 'jsname', 'data-attrid', 'icon-name', 'data-item-id', 'name', 'type']) { const v = el.getAttribute(a); if (v && v.length < 60) part += '[' + a + '="' + CSS.escape(v) + '"]'; }
    const href = el.getAttribute('href'); if (href) { try { const u = new URL(href, location.href); if (u.pathname.length > 1 && u.pathname.length < 60) part += '[href*="' + CSS.escape(u.pathname) + '"]'; } catch {} }
    return part;
  };
  const sel = el => { const parts = []; for (let e = el, i = 0; e && e.nodeType === 1 && i < 3 && e !== document.body; e = e.parentElement, i++) parts.unshift(stable(e)); return parts.join(' > '); };
  const leaves = el => { const t = []; const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); for (let n = w.nextNode(); n && t.length < 40; n = w.nextNode()) { const v = n.nodeValue.replace(/\\s+/g, ' ').trim(); if (v.length > 1 && v.length < 50) t.push(v); } for (const a of ['aria-label', 'title', 'placeholder']) { const v = el.getAttribute(a); if (v) t.push('@' + a + ':' + v.trim()); } return t; };`;
const ENGLISH = `(() => { ${STABLE}
  const marked = [...document.body.querySelectorAll('*')].filter(el => [...el.attributes].some(a => /^data-(?:net19|n19)-/.test(a.name) && !/^data-net19-(?:rc|glyph|plain|photo|reading|ink)$/.test(a.name)) && getComputedStyle(el).display === 'none');
  return marked.slice(0, 200).map(el => ({ sel: sel(el), leaves: leaves(el) })).filter(x => { try { return document.querySelectorAll(x.sel).length === 1; } catch { return false; } }); })()`;
const LOCAL = sels => `(() => { ${STABLE} const sels = ${JSON.stringify(sels)}; return { lang: document.documentElement.lang || '', found: sels.map(s => { let list = []; try { list = [...document.querySelectorAll(s)]; } catch {} return list.length === 1 ? leaves(list[0]) : null; }) }; })()`;

const open = async lang => {
  const ctx = await chromium.launchPersistentContext('', { channel: 'chromium', headless: true, locale: lang, viewport: { width: 1366, height: 860 },
    extraHTTPHeaders: { 'Accept-Language': `${lang},${short(lang)};q=0.9` },
    args: [...(process.env.HTTPS_PROXY ? [`--proxy-server=${process.env.HTTPS_PROXY}`] : []), `--lang=${lang}`, `--disable-extensions-except=${EXT}`, `--load-extension=${EXT}`] });
  let worker = ctx.serviceWorkers().find(w => w.url().endsWith('/background.js'));
  while (!worker) { const w = await ctx.waitForEvent('serviceworker'); if (w.url().endsWith('/background.js')) worker = w; }
  for (let t = 0; t < 100; t++) { if (await worker.evaluate(async () => (await chrome.scripting.getRegisteredContentScripts()).length).catch(() => 0) >= 10) break; await new Promise(r => setTimeout(r, 200)); }
  return ctx;
};
const visit = async (ctx, url, script) => {
  let page;
  try { page = await ctx.newPage(); } catch { return null; }
  try { await page.goto(url, { waitUntil: 'load', timeout: 35000 }).catch(() => {}); await page.waitForTimeout(4500); return await page.evaluate(script); }
  catch { return null; } finally { await page.close().catch(() => {}); }
};
const pool = async (items, run, width = 3) => { let next = 0; await Promise.all(Array.from({ length: width }, async () => { while (next < items.length) await run(items[next++]); })); };

const noise = (local, english) => local === english || local.length > 48 || !/\p{L}/u.test(local) || /\d{2}/.test(local) || /^[\p{Lu}\d\s]{1,3}$/u.test(local);
const report = {};
const en = await open('en-US');
const english = {};
await pool(list, async id => { english[id] = (await visit(en, URLS[id], ENGLISH)) || []; });
await en.close();
const pending = new Set(list.filter(id => english[id].length));
for (const lang of LANGS) {
  const ctx = await open(lang);
  await pool([...pending], async id => {
    const url = localized(id, lang);
    if (!url) return;
    const items = english[id];
    const seen = await visit(ctx, url, LOCAL(items.map(item => item.sel)));
    if (!seen) return;
    if (/^en\b/i.test(seen.lang) && lang === LANGS[0]) { pending.delete(id); return; }
    const pairs = {};
    items.forEach((item, k) => {
      const local = seen.found[k];
      if (!local || local.length !== item.leaves.length) return;
      local.forEach((value, n) => {
        const from = item.leaves[n];
        if (from.startsWith('@') !== value.startsWith('@')) return;
        const a = value.replace(/^@[a-z-]+:/, ''), b = from.replace(/^@[a-z-]+:/, '');
        if (!noise(a, b)) pairs[a] = b;
      });
    });
    if (Object.keys(pairs).length) (report[id] ||= {})[short(lang)] = pairs;
  });
  await ctx.close();
  console.log(`${lang}: ${Object.values(report).filter(r => r[short(lang)]).length} themes with words`);
}
mkdirSync(new URL('.', REPORT), { recursive: true });
writeFileSync(REPORT, JSON.stringify(report, null, 1));
console.log(`Wrote ${REPORT.pathname}`);

if (WRITE) {
  const conflicts = [];
  for (const [id, byLang] of Object.entries(report)) {
    const file = new URL(`themes/${id}.js`, root);
    let source;
    try { source = readFileSync(file, 'utf8'); } catch { continue; }
    const line = /^globalThis\.net19Theme\.words = (\{.*\});$/m.exec(source);
    const words = line ? JSON.parse(line[1]) : {};
    const before = JSON.stringify(words);
    const merged = {};
    for (const pairs of Object.values(byLang)) for (const [local, label] of Object.entries(pairs)) {
      if (local in merged && merged[local] !== label) merged[local] = null; else if (!(local in merged)) merged[local] = label;
    }
    for (const [local, label] of Object.entries(merged)) {
      if (label === null) { conflicts.push(`${id}: ${local}`); continue; }
      if (!(local in words)) words[local] = label;
    }
    if (JSON.stringify(words) === before) continue;
    const next = `globalThis.net19Theme.words = ${JSON.stringify(words)};`;
    writeFileSync(file, line ? source.replace(line[0], next) : `${source.replace(/\n?$/, '\n')}${next}\n`);
    console.log(`themes/${id}.js: ${Object.keys(words).length} words`);
  }
  if (conflicts.length) console.log(`Skipped labels that mean different things: ${conflicts.join(', ')}`);
}
