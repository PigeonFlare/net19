import { chromium } from '@playwright/test';
import { resolve } from 'node:path';
import { mkdirSync, appendFileSync, readFileSync } from 'node:fs';
import { THEMES } from '../src/themes.ts';

const URLS = JSON.parse(readFileSync(new URL('./audit-urls.json', import.meta.url), 'utf8'));
const pick = process.argv.slice(2);
const OUT = resolve(process.env.OUT || 'test-results/nav'), ext = resolve(process.env.EXT || '.');
const MAX = +(process.env.MAX || 12);
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const BRAND = {
  google: ['about.google', 'blog.google', 'store.google', 'g.co', 'withgoogle.com', 'google.co', 'youtube.com', 'gmail.com'],
  microsoft: ['microsoft365.com', 'office.com', 'live.com', 'bing.com', 'xbox.com', 'msn.com'],
  apple: ['apple.co'],
  yahoo: ['yahoo.net'],
  facebook: ['fb.com', 'messenger.com', 'instagram.com', 'meta.com'],
  instagram: ['facebook.com', 'threads.com'],
  twitter: ['twitter.com', 'x.com'],
  amazon: ['amazon.jobs', 'aboutamazon.com'],
  nytimes: ['nyt.com'],
};
const registrable = host => { const l = host.replace(/^www\./, '').split('.'); return l.slice(/^(co|com|ne|or|ac|go|net|org|gov|edu)\.[a-z]{2}$/.test(l.slice(-2).join('.')) ? -3 : -2).join('.'); };
const siteOf = id => THEMES.find(t => t.id === id);

async function collect(p) {
  const openers = await p.$$('header [aria-haspopup]:not([aria-haspopup=false]), header button[aria-expanded=false], [role=banner] [aria-haspopup], a[aria-label*="apps" i], [aria-label="Google apps"], nav [aria-haspopup]');
  const links = new Map();
  const grab = async () => {
    for (const frame of p.frames()) {
      const found = await frame.$$eval('a[href]', as => as.filter(a => { const r = a.getBoundingClientRect(); const c = getComputedStyle(a); return (r.width > 2 && r.height > 2 && c.visibility === 'visible') || a.closest('header,footer,nav,[role=banner],[role=navigation],[role=contentinfo],[role=menu]'); })
        .map(a => ({ href: a.href, text: (a.getAttribute('aria-label') || a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40),
          where: a.closest('header,[role=banner]') ? 'header' : a.closest('footer,[role=contentinfo]') ? 'footer' : a.closest('nav,[role=navigation],[role=menu],[role=dialog],[aria-modal]') ? 'nav' : 'body' }))).catch(() => []);
      for (const l of found) if (!links.has(l.href)) links.set(l.href, l);
    }
  };
  await grab();
  for (const o of openers.slice(0, 5)) {
    if (!(await o.isVisible().catch(() => false))) continue;
    await o.click({ timeout: 2500 }).catch(() => {}); await p.waitForTimeout(1200);
    await grab();
    await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(300);
  }
  return [...links.values()];
}

const targets = Object.entries(URLS).filter(([id]) => !pick.length || pick.includes(id));
for (const [id, url] of targets) {
  const theme = siteOf(id); if (!theme) continue;
  const own = new Set([...theme.domains, ...(BRAND[id] || [])]);
  mkdirSync(`${OUT}/${id}`, { recursive: true });
  const ctx = await chromium.launchPersistentContext('', { channel: 'chromium', headless: true, viewport: { width: 1280, height: 860 }, userAgent: UA,
    args: [...(process.env.HTTPS_PROXY ? [`--proxy-server=${process.env.HTTPS_PROXY}`] : []), `--disable-extensions-except=${ext}`, `--load-extension=${ext}`] });
  await new Promise(r => setTimeout(r, 1500));
  const p = await ctx.newPage();
  const result = { id, start: url, visited: [] };
  try {
    await p.goto(url, { waitUntil: 'load', timeout: 40000 }).catch(() => {}); await p.waitForTimeout(3000);
    const links = (await collect(p)).filter(l => { try { const u = new URL(l.href); return /^https?:$/.test(u.protocol) && own.has(registrable(u.hostname)) && !/logout|signout|sign_out|log_out/i.test(u.href); } catch { return false; } });
    const order = { header: 0, nav: 1, footer: 2, body: 3 };
    const seen = new Set([new URL(url).hostname + '/' + (new URL(url).pathname.split('/')[1] || '')]);
    const chosen = [];
    for (const l of links.sort((a, b) => order[a.where] - order[b.where])) {
      const u = new URL(l.href); const key = u.hostname + '/' + (u.pathname.split('/')[1] || '');
      if (seen.has(key)) continue; seen.add(key); chosen.push(l);
      if (chosen.length >= MAX) break;
    }
    let n = 0;
    for (const l of chosen) {
      const q = await ctx.newPage();
      await q.goto(l.href, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
      await q.waitForTimeout(2500);
      const state = await q.evaluate(() => ({ url: location.href, styled: !!document.documentElement.dataset.net19Mode, title: document.title.slice(0, 60) })).catch(e => ({ url: l.href, styled: false, err: e.message.slice(0, 60) }));
      await q.screenshot({ path: `${OUT}/${id}/${++n}.png` }).catch(() => {});
      result.visited.push({ n, text: l.text, where: l.where, ...state });
      await q.close();
    }
  } catch (e) { result.err = e.message.slice(0, 100); }
  appendFileSync(`${OUT}/report.jsonl`, JSON.stringify(result) + '\n');
  const miss = result.visited.filter(v => !v.styled);
  console.log(`${id}: ${result.visited.length - miss.length}/${result.visited.length} styled` + miss.map(m => `\n  MISS ${m.n} [${m.where}] ${m.text} -> ${m.url}`).join(''));
  await ctx.close();
}
