import { chromium } from '@playwright/test';
import { resolve } from 'node:path';
import { mkdirSync, appendFileSync } from 'node:fs';
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
const PAGE_CHECKS = readFileSync(new URL('./page-checks.js', import.meta.url), 'utf8').replace(/^if \(typeof module[^\n]*$/m, '');
const ALL = JSON.parse(readFileSync(new URL('./urls.json', import.meta.url), 'utf8'));
const pick = process.argv.slice(2);
const URLS = process.env.URLS ? JSON.parse(process.env.URLS) : Object.fromEntries(Object.entries(ALL).filter(([id]) => !pick.length || pick.includes(id)));
const OUT = resolve(process.env.OUT || 'test-results/audit'), ext = resolve(process.env.EXT || '.');
const SCHEMES = (process.env.SCHEMES || 'light,dark').split(',');
const WIDTHS = (process.env.WIDTHS || '1280,1000').split(',').map(Number);
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const MODERN = /\b(AI|Gemini|Copilot|Grok|ChatGPT|Rufus|Meta AI|Shorts|Reels|Quests|Communities|Spaces)\b|^ask\b(?! question)|create images?|brainstorm|ask about|generate|help me write|or ask a question|ask anything/i;

function inPage() {
  const vis = e => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e); return r.width > 2 && r.height > 2 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth && c.visibility === 'visible' && +c.opacity > .05; };
  const texts = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  for (let n = walker.nextNode(); n && texts.length < 1500; n = walker.nextNode()) {
    const t = n.nodeValue.trim(); const el = n.parentElement;
    if (t.length < 2 || !el || seen.has(el) || el.closest('script,style,noscript')) continue;
    seen.add(el);
    if (!vis(el)) continue;
    const range = document.createRange(); range.selectNodeContents(n);
    const r = range.getBoundingClientRect();
    if (r.width < 4 || r.height < 6) continue;
    const cx = Math.min(innerWidth - 1, r.left + Math.min(r.width, 40) / 2), cy = r.top + r.height / 2;
    const hit = document.elementFromPoint(cx, cy);
    if (!hit || !(hit === el || el.contains(hit) || hit.contains(el))) continue;
    texts.push({ t: t.slice(0, 40), x: r.left, y: r.top, w: r.width, h: r.height, ink: el.closest('[data-net19-ink]')?.getAttribute('data-net19-ink') || '' });
  }
  const controls = [...document.querySelectorAll('button,a,[role=button],[role=tab],[role=menuitem],input,textarea')].filter(vis);
  const modern = [];
  for (const c of controls) {
    const label = (c.getAttribute('aria-label') || c.textContent || '').replace(/\s+/g, ' ').trim();
    if (label && label.length < 45 && /\b(AI|Gemini|Copilot|Grok|ChatGPT|Rufus|Shorts|Reels|Quests|Communities|Spaces)\b|^ask\b(?! question)|create images?|brainstorm|ask about|generate|help me write/i.test(label)) { const r = c.getBoundingClientRect(); modern.push({ t: label, x: r.left, y: r.top, w: r.width, h: r.height }); }
    const ph = c.getAttribute('placeholder');
    if (ph && /ask|chat/i.test(ph)) { const r = c.getBoundingClientRect(); modern.push({ t: 'placeholder: ' + ph, x: r.left, y: r.top, w: r.width, h: r.height }); }
  }
  const header = controls.concat([...document.querySelectorAll('img,svg')].filter(vis)).map(e => ({ e, r: e.getBoundingClientRect() }))
    .filter(({ r }) => r.top >= 0 && r.bottom < 140 && r.height < 70 && r.width < 700);
  const top = header.filter(({ e }) => !header.some(o => o.e !== e && o.e.contains(e) && o.r.height < 70));
  const rows = [];
  for (const it of top.sort((a, b) => (a.r.top + a.r.height / 2) - (b.r.top + b.r.height / 2))) {
    const cy = it.r.top + it.r.height / 2; const row = rows.find(rw => Math.abs(rw.cy - cy) < 16);
    if (row) row.items.push({ ...it, cy }); else rows.push({ cy, items: [{ ...it, cy }] });
  }
  const misaligned = [];
  for (const row of rows) if (row.items.length >= 3) {
    const med = row.items.map(i => i.cy).sort((a, b) => a - b)[row.items.length >> 1];
    for (const i of row.items) if (Math.abs(i.cy - med) > 5 && i.r.height > 10) misaligned.push({ t: (i.e.getAttribute('aria-label') || i.e.textContent || i.e.tagName).trim().slice(0, 30), dy: Math.round(i.cy - med), x: i.r.left, y: i.r.top, w: i.r.width, h: i.r.height });
  }
  const inside = [];
  for (const f of controls.filter(c => c.matches('input[type=text],input[type=search],input:not([type]),textarea'))) {
    const fr = f.closest('form, [role=search], [class*="search" i]')?.getBoundingClientRect() || f.getBoundingClientRect();
    const ir = f.getBoundingClientRect();
    for (const b of controls.filter(c => c.matches('button,[role=button]') && !c.contains(f))) {
      const br = b.getBoundingClientRect();
      const ox = Math.max(0, Math.min(br.right, ir.right + 2) - Math.max(br.left, ir.left - 2)), oy = Math.max(0, Math.min(br.bottom, ir.bottom) - Math.max(br.top, ir.top));
      if (ox * oy > .5 * br.width * br.height && getComputedStyle(b).borderRadius.startsWith('50%')) inside.push({ t: (b.getAttribute('aria-label') || '').slice(0, 30), x: br.left, y: br.top, w: br.width, h: br.height });
    }
    void fr;
  }
  return { texts, modern, misaligned, inside, mode: document.documentElement.dataset.net19Mode || '', flip: document.documentElement.hasAttribute('data-net19-flip'), title: document.title.slice(0, 50) };
}

const ROWS = ['clipline', 'rowwrap', 'rowalign', 'spill', 'iconovertext', 'gap', 'btnsize', 'scrollreach', 'badgealign', 'loose'];
const TITLES = 'a[href] :is(h2, h3, [role=heading]), :is(h2, h3, [role=heading]) a[href], a#video-title, main [role=heading], [data-testid*="title" i]';
function findTitles(selector) {
  const out = [];
  for (const e of document.querySelectorAll(selector)) {
    const r = e.getBoundingClientRect(), c = getComputedStyle(e), text = (e.textContent || '').replace(/\s+/g, ' ').trim();
    if (r.width < 60 || r.height < 8 || r.top < 90 || r.bottom > innerHeight - 10 || c.visibility !== 'visible' || text.length < 8 || e.closest('header, nav, footer, [role=navigation], [role=banner], aside')) continue;
    const x = r.left + Math.min(r.width / 2, 80), y = r.top + Math.min(r.height / 2, 10);
    if (out.some(o => Math.abs(o.y - y) < 12 && Math.abs(o.x - x) < 120 || o.text === text.slice(0, 40))) continue;
    out.push({ x, y, text: text.slice(0, 40) });
  }
  return out.sort((a, b) => a.y - b.y || a.x - b.x).slice(0, 3);
}
function titleTarget({ x, y }) {
  const hit = document.elementFromPoint(x, y);
  const link = hit?.closest('a[href]');
  if (!link) return { ok: false, why: `nothing at its title links anywhere (${hit ? hit.tagName.toLowerCase() : 'no element'} is on top)` };
  const href = link.getAttribute('href') || '';
  let to = null; try { to = new URL(link.href); } catch {}
  const here = new URL(location.href);
  if (/^(#|javascript:)/i.test(href) || !to || to.origin + to.pathname + to.search === here.origin + here.pathname + here.search) return { ok: false, why: `its link goes nowhere (href "${href.slice(0, 40)}")` };
  return { ok: true };
}

const lum = (r, g, b) => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
async function faint(png, texts, width) {
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, C = info.channels, scale = W / width;
  const L = (x, y) => { const i = (Math.min(H - 1, Math.max(0, y)) * W + Math.min(W - 1, Math.max(0, x))) * C; return lum(data[i], data[i + 1], data[i + 2]); };
  const out = [];
  for (const t of texts) {
    const x0 = Math.round(t.x * scale), y0 = Math.round(t.y * scale), x1 = Math.round((t.x + t.w) * scale), y1 = Math.round((t.y + t.h) * scale);
    if (x1 - x0 < 4 || y1 - y0 < 5 || y0 < 0 || y1 > H) continue;
    const ring = []; for (let x = x0; x < x1; x += 2) { ring.push(L(x, y0 - 1), L(x, y1)); } for (let y = y0; y < y1; y += 2) { ring.push(L(x0 - 2, y), L(x1 + 1, y)); }
    ring.sort((a, b) => a - b); const bg = ring[ring.length >> 1];
    const diffs = []; for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x += 1) diffs.push(L(x, y));
    let best = bg; let far = 0;
    const sorted = diffs.map(v => [Math.abs(v - bg), v]).sort((a, b) => b[0] - a[0]);
    const pick = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * .03))]; if (pick) { far = pick[0]; best = pick[1]; }
    const ratio = (Math.max(best, bg) + .05) / (Math.min(best, bg) + .05);
    if (ratio < 1.9) out.push({ ...t, ratio: +ratio.toFixed(2) });
  }
  return out;
}
async function mark(png, boxes, file, width) {
  const img = sharp(png); const meta = await img.metadata(); const s = meta.width / width;
  const rects = boxes.map(b => `<rect x="${b.x * s - 2}" y="${b.y * s - 2}" width="${b.w * s + 4}" height="${b.h * s + 4}" fill="none" stroke="${b.c}" stroke-width="3"/>`).join('');
  await img.composite([{ input: Buffer.from(`<svg width="${meta.width}" height="${meta.height}">${rects}</svg>`) }]).png().toFile(file);
}

for (const [id, url] of Object.entries(URLS)) for (const scheme of SCHEMES) for (const width of WIDTHS) {
  const full = width === WIDTHS[0], at = full ? '' : `w${width}-`;
  mkdirSync(`${OUT}/${id}`, { recursive: true });
  const ctx = await chromium.launchPersistentContext(`/tmp/stress-${id}-${scheme}-${width}-${Date.now()}`, { channel: 'chromium', headless: true, viewport: { width, height: 860 }, colorScheme: scheme, userAgent: UA,
    args: [...(process.env.HTTPS_PROXY ? [`--proxy-server=${process.env.HTTPS_PROXY}`] : []), `--disable-extensions-except=${ext}`, `--load-extension=${ext}`] });
  await new Promise(r => setTimeout(r, 1500));
  const p = await ctx.newPage();
  const result = { id, scheme, width, states: {} };
  const record = async state => {
    state = at + state;
    const png = await p.screenshot().catch(() => null); if (!png) return;
    const info = await p.evaluate(inPage).catch(e => ({ err: e.message.slice(0, 80) }));
    if (info.err) { result.states[state] = info; return; }
    const faintOnes = await faint(png, info.texts, width);
    const checks = await p.evaluate(`(() => { ${PAGE_CHECKS}; return net19PageChecks(); })()`).catch(() => ({ covered: [], offcenter: [], textoffcenter: [], overlap: [] }));
    result.states[state] = { mode: info.mode, flip: info.flip, title: info.title, faint: faintOnes.map(f => `${f.t} (${f.ratio})`), modern: info.modern.map(m => m.t), misaligned: info.misaligned.map(m => `${m.t} ${m.dy}px`), inside: info.inside.map(m => m.t || 'button'), inked: info.texts.filter(t => t.ink).length,
      covered: checks.covered.map(c => `${c.what} ${c.detail}`), offcenter: checks.offcenter.map(c => `${c.what} ${c.detail}`), textoffcenter: checks.textoffcenter.map(c => `${c.what} ${c.detail}`), overlap: checks.overlap.map(c => `${c.what} ${c.detail}`), collide: (checks.collide || []).map(c => `${c.what} ${c.detail}`), effects: (checks.effects || []).map(c => `${c.what} ${c.detail}`), cropped: (checks.cropped || []).map(c => `${c.what} ${c.detail}`), lowcontrast: (checks.lowcontrast || []).map(c => `${c.what} ${c.detail}`),
      ...Object.fromEntries(ROWS.map(k => [k, (checks[k] || []).map(c => `${c.what} ${c.detail}`)])) };
    const boxes = [...faintOnes.map(b => ({ ...b, c: 'magenta' })), ...info.modern.map(b => ({ ...b, c: 'orange' })), ...info.misaligned.map(b => ({ ...b, c: 'cyan' })), ...info.inside.map(b => ({ ...b, c: 'lime' })), ...checks.covered.map(b => ({ ...b, c: 'red' })), ...checks.offcenter.map(b => ({ ...b, c: 'yellow' })), ...checks.textoffcenter.map(b => ({ ...b, c: 'yellow' })), ...checks.overlap.map(b => ({ ...b, c: 'blue' })), ...ROWS.flatMap(k => (checks[k] || []).map(b => ({ ...b, c: 'deeppink' })))];
    await mark(png, boxes, `${OUT}/${id}/${scheme}-${state}.png`, width);
  };
  try {
    await p.goto(url, { waitUntil: 'load', timeout: 40000 }).catch(() => {});
    await p.waitForTimeout(3500);
    await record('load');
    const triggers = await p.$$eval('header a, header button, nav a, nav button, [role=navigation] a, [aria-haspopup]:not([aria-haspopup=false]), [aria-expanded]', els => els.map((e, i) => { const r = e.getBoundingClientRect(); return { i, x: r.left + r.width / 2, y: r.top + r.height / 2, ok: r.width > 8 && r.height > 8 && r.top >= 0 && r.top < 130 && getComputedStyle(e).visibility === 'visible' }; }).filter(e => e.ok).slice(0, 6)).catch(() => []);
    let n = 0;
    for (const t of full ? triggers : triggers.slice(0, 1)) { await p.mouse.move(t.x, t.y); await p.waitForTimeout(900); await record(`hover${++n}`); }
    if (full) {
    const sideItems = await p.$$eval('nav a, aside a, [role=navigation] a, [role=complementary] a, [role=tree] [role=treeitem], [role=listitem] a', els => els.map(e => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, ok: r.width > 20 && r.height > 12 && r.top >= 130 && r.bottom < innerHeight && getComputedStyle(e).visibility === 'visible' }; }).filter(e => e.ok).filter((e, i, all) => all.findIndex(o => Math.abs(o.x - e.x) < 40 && Math.abs(o.y - e.y) < 40) === i).slice(0, 4)).catch(() => []);
    for (const t of sideItems) { await p.mouse.move(t.x, t.y); await p.waitForTimeout(700); await record(`sidehover${++n}`); }
    const titles = await p.evaluate(`(${findTitles})(${JSON.stringify(TITLES)})`).catch(() => []);
    for (const [k, t] of titles.entries()) { await p.mouse.move(t.x, t.y); await p.waitForTimeout(900); await record(`content${k + 1}`); }
    await p.mouse.move(5, 850);
    const search = await p.$('input[type=search], input[name=q], input[name=search_query], textarea[name=q], input[role=combobox], input[placeholder*="earch" i], input[aria-label*="earch" i]');
    if (search && await search.isVisible().catch(() => false)) {
      const box = await search.boundingBox();
      const shellBefore = await search.evaluate(f => { const r = (f.closest('form, [role=search]') || f).getBoundingClientRect(); return { left: r.left, top: r.top, right: r.right, bottom: r.bottom }; }).catch(() => null);
      if (box) await p.mouse.click(box.x + Math.min(box.width / 2, 60), box.y + box.height / 2); else await search.click({ timeout: 3000 }).catch(() => {});
      await p.waitForTimeout(300);
      await p.keyboard.type('new', { delay: 60 }); await p.waitForTimeout(1600);
      const typed = await search.evaluate(f => ({ focused: f === document.activeElement || f.contains(document.activeElement) || f.getRootNode().activeElement === f, value: f.value || f.textContent || '' })).catch(() => ({ focused: false, value: '' }));
      if (!typed.focused || !/new/.test(typed.value)) result.blocked = `search field did not take a click and typing (focused ${typed.focused}, value "${typed.value.slice(0, 20)}")`;
      const grownOver = await search.evaluate((f, before) => {
        const shell = f.closest('form, [role=search]') || f;
        const now = shell.getBoundingClientRect();
        const popup = e => e.closest('[role=listbox], [role=option], [role=dialog], [role=menu]');
        const hits = [];
        for (const e of document.querySelectorAll('button, a, [role=button], img, svg, input')) {
          if (shell.contains(e) || e.contains(shell) || popup(e)) continue;
          const r = e.getBoundingClientRect(), c = getComputedStyle(e);
          if (r.width < 6 || r.height < 6 || c.visibility !== 'visible' || +c.opacity < .1) continue;
          const wasClear = Math.min(r.right, before.right) <= Math.max(r.left, before.left) || Math.min(r.bottom, before.bottom) <= Math.max(r.top, before.top);
          const ox = Math.min(r.right, now.right) - Math.max(r.left, now.left), oy = Math.min(r.bottom, now.bottom) - Math.max(r.top, now.top);
          if (wasClear && ox > 4 && oy > 4) hits.push((e.getAttribute('aria-label') || e.textContent || e.tagName).trim().slice(0, 30));
        }
        return hits;
      }, shellBefore || { left: 0, top: 0, right: 0, bottom: 0 }).catch(() => []);
      if (grownOver.length) result.fieldgrow = `the focused search field grew over: ${grownOver.join(', ')}`;
      const focusProblems = await search.evaluate((f, before) => {
        const problems = [];
        const shell = f.closest('form, [role=search]') || f;
        const now = shell.getBoundingClientRect();
        if (before && (Math.abs(now.top - before.top) > 3 || Math.abs(now.left - before.left) > 3)) problems.push(`field moved ${Math.round(now.left - before.left)},${Math.round(now.top - before.top)}px when focused`);
        for (const e of document.querySelectorAll('body *')) {
          const c = getComputedStyle(e);
          if (!/fixed|absolute/.test(c.position) || e.contains(shell)) continue;
          const r = e.getBoundingClientRect();
          if (r.width < innerWidth * .8 || r.height < innerHeight * .5) continue;
          const bg = c.backgroundColor.match(/[\d.]+/g);
          if (bg && bg.length === 4 && +bg[3] > .05 && +bg[3] < .95 && c.visibility === 'visible' && +c.opacity > .05) { problems.push(`a backdrop (${e.tagName.toLowerCase()}) dims the page when the field is focused`); break; }
        }
        for (const list of document.querySelectorAll('[role=listbox], [role=menu]')) {
          const r = list.getBoundingClientRect();
          if (r.width < 40 || r.height < 10 || getComputedStyle(list).visibility !== 'visible') continue;
          if (list.scrollHeight > list.clientHeight + 4 && /hidden|clip/.test(getComputedStyle(list).overflowY)) problems.push('suggestions are cut off inside their box');
          for (let a = list.parentElement; a && a !== document.body; a = a.parentElement) {
            const c = getComputedStyle(a); if (!/hidden|clip/.test(c.overflowX + c.overflowY)) continue;
            const q = a.getBoundingClientRect();
            if (r.bottom > q.bottom + 4 || r.right > q.right + 4) { problems.push(`suggestions are cut off by ${a.tagName.toLowerCase()}${a.id ? '#' + a.id : ''}`); break; }
          }
        }
        return problems;
      }, shellBefore).catch(() => []);
      if (focusProblems.length) result.focus = focusProblems.join('; ');
      await record('search');
      await p.keyboard.press('Escape');
    }
    const menu = await p.$('[aria-haspopup]:not([aria-haspopup=false]), button[aria-expanded=false]');
    if (menu && await menu.isVisible().catch(() => false)) { await menu.click({ timeout: 3000 }).catch(() => {}); await p.waitForTimeout(1200); await record('menu'); }
    await p.keyboard.press('Escape').catch(() => {});
    await p.mouse.move(5, 850);
    await p.waitForTimeout(400);
    const [first] = await p.evaluate(`(${findTitles})(${JSON.stringify(TITLES)})`).catch(() => []);
    if (first) {
      const target = await p.evaluate(`(${titleTarget})(${JSON.stringify(first)})`).catch(() => ({ ok: false, why: 'could not be read' }));
      if (!target.ok) {
        const before = p.url();
        const opened = ctx.waitForEvent('page', { timeout: 4000 }).catch(() => null);
        await p.mouse.click(first.x, first.y);
        const moved = await Promise.race([p.waitForURL(u => u.href !== before, { timeout: 4000 }).then(() => true).catch(() => false), opened.then(Boolean)]);
        if (!moved) result.titleclick = `result title "${first.text}": ${target.why}, and clicking it opened nothing`;
      }
    }
    }
  } catch (e) { result.err = e.message.slice(0, 100); }
  appendFileSync(`${OUT}/report.jsonl`, JSON.stringify(result) + '\n');
  console.log(id, scheme, width, result.blocked ? 'BLOCKED: ' + result.blocked : '', result.fieldgrow ? 'FIELD GREW: ' + result.fieldgrow : '', result.focus ? 'FOCUS: ' + result.focus : '', result.titleclick ? 'TITLE CLICK: ' + result.titleclick : '', Object.entries(result.states).map(([k, v]) => `${k}:${(v.faint?.length || 0)}f/${(v.modern?.length || 0)}m/${(v.misaligned?.length || 0)}a/${(v.inside?.length || 0)}i/${(v.covered?.length || 0)}c/${(v.offcenter?.length || 0) + (v.textoffcenter?.length || 0)}o/${(v.overlap?.length || 0)}x/${(v.collide?.length || 0)}k/${(v.effects?.length || 0)}e/${(v.cropped?.length || 0)}r/${(v.lowcontrast?.length || 0)}l/${(v.clipline?.length || 0)}q/${(v.rowwrap?.length || 0)}w/${(v.rowalign?.length || 0)}n/${(v.spill?.length || 0)}s/${(v.iconovertext?.length || 0)}v/${(v.gap?.length || 0)}g/${(v.btnsize?.length || 0)}b/${(v.scrollreach?.length || 0)}h/${(v.patch?.length || 0)}p/${(v.tight?.length || 0)}t/${(v.loose?.length || 0)}z/${(v.badgealign?.length || 0)}d`).join(' '));
  await ctx.close();
}
