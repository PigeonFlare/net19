// net19 page checks: run inside a page (Playwright's page.evaluate, or pasted into a real signed-in browser) after a
// theme has applied. They catch the kinds of breakage a screenshot glance misses:
//  - covered: a field, button or link whose center is covered by another element, so a real click never reaches it
//    (how YouTube's search field became unclickable);
//  - offcenter: an icon or avatar off the center of the square button, tile or narrow rail that holds it (Discord's
//    server icons sitting left in their rail);
//  - textoffcenter: one line of text off the vertical middle of the fixed-height button, tab or row that holds it;
//  - overlap: two different lines of text drawn over each other.
// Returns { covered, offcenter, textoffcenter, overlap }, each a list of { what, detail, x, y, w, h }.
// eslint-disable-next-line no-unused-vars
function net19PageChecks() {
  const out = { covered: [], offcenter: [], textoffcenter: [], overlap: [] };
  const W = innerWidth, H = innerHeight;
  const shown = e => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e);
    return r.width > 1 && r.height > 1 && r.bottom > 0 && r.right > 0 && r.top < H && r.left < W && c.visibility === 'visible' && +c.opacity > .05 && c.display !== 'none'; };
  const name = e => (e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '')).slice(0, 70);
  const label = e => (e.getAttribute('aria-label') || e.getAttribute('placeholder') || e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40);
  const box = (e, r = e.getBoundingClientRect()) => ({ x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) });
  const deepHit = (x, y) => { let h = document.elementFromPoint(x, y); while (h && h.shadowRoot) { const inner = h.shadowRoot.elementFromPoint(x, y); if (!inner || inner === h) break; h = inner; } return h; };
  // A point scrolled out of a scrolling or clipping ancestor isn't visible, so nothing there can be clicked anyway.
  const clipped = (e, x, y) => { for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) { const c = getComputedStyle(a);
    if (/auto|scroll|hidden|clip/.test(c.overflowX + c.overflowY)) { const q = a.getBoundingClientRect(); if (x < q.left || x > q.right || y < q.top || y > q.bottom) return true; } } return false; };
  const within = (hit, e) => !!hit && (hit === e || e.contains(hit) || (hit.getRootNode() !== document && e.contains(hit.getRootNode().host)));

  // covered: probe the center (and, for fields, a point near the left where people click) of every visible control.
  const controls = [...document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]), textarea, [contenteditable=true], [role=textbox], [role=searchbox], [role=combobox], button, a[href], [role=button], [role=tab]')]
    .filter(e => shown(e) && !e.disabled).slice(0, 600);
  for (const e of controls) {
    const r = e.getBoundingClientRect();
    if (r.width < 6 || r.height < 6) continue;
    const field = e.matches('input, textarea, [contenteditable=true], [role=textbox], [role=searchbox], [role=combobox]');
    const points = [[r.left + r.width / 2, r.top + r.height / 2]];
    if (field) points.push([r.left + Math.min(24, r.width / 4), r.top + r.height / 2]);
    for (const [x, y] of points) {
      if (x < 0 || y < 0 || x >= W || y >= H || clipped(e, x, y)) continue;
      const hit = deepHit(x, y);
      if (within(hit, e)) continue;
      // A label wrapping the field, or a field's own decoration inside a shared wrapper, still focuses it on click.
      if (field && hit && (hit.closest('label')?.contains(e) || (hit.tagName === 'LABEL' && hit.htmlFor === e.id))) continue;
      // A link or button laid over its sibling on purpose (an image's "open original" link) is the control people hit.
      if (!field && hit && hit.closest('a[href], button, [role=button]') && hit.closest('a[href], button, [role=button]').parentElement?.contains(e)) continue;
      // Another control inside this one's box that is meant to be clicked (a clear button over a field's right end) is fine
      // at the right edge, but never at the field's center or left.
      out.covered.push({ what: `${field ? 'field' : 'control'} "${label(e)}" ${name(e)}`, detail: `covered by ${hit ? name(hit) : 'nothing (outside page)'}`, ...box(e) });
      break;
    }
  }

  // offcenter: a single visible icon/avatar/image inside a small square-ish button or tile, or items in a narrow rail.
  const media = 'svg, img, [class*="icon" i], [class*="avatar" i]';
  for (const holder of document.querySelectorAll('button, a, [role=button], [role=treeitem], [role=listitem], li')) {
    if (!shown(holder)) continue;
    const r = holder.getBoundingClientRect();
    if (r.width < 20 || r.width > 72 || r.height < 20 || r.height > 72 || Math.abs(r.width - r.height) > 10) continue;
    if ((holder.textContent || '').trim()) continue;
    const kids = [...holder.querySelectorAll(media)].filter(shown).filter(k => { const q = k.getBoundingClientRect(); return q.width >= 10 && q.width <= r.width && q.height <= r.height; });
    if (!kids.length) continue;
    const k = kids.sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0];
    const q = k.getBoundingClientRect();
    const dx = (q.left + q.width / 2) - (r.left + r.width / 2), dy = (q.top + q.height / 2) - (r.top + r.height / 2);
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) out.offcenter.push({ what: `${name(k)} in ${name(holder)}`, detail: `off by ${Math.round(dx)},${Math.round(dy)}px`, ...box(holder) });
  }
  // Narrow full-height rails (a server list, an icon nav): every item's center should share the rail's center line.
  for (const rail of document.querySelectorAll('nav, aside, [role=navigation], [role=tree], [class*="rail" i], [class*="guild" i], [class*="sidebar" i]')) {
    if (!shown(rail)) continue;
    const r = rail.getBoundingClientRect();
    if (r.width < 40 || r.width > 110 || r.height < 250) continue;
    const items = [...rail.querySelectorAll('img, svg, [class*="avatar" i], [class*="icon" i]')].filter(shown).filter(k => { const q = k.getBoundingClientRect(); return q.width >= 24 && q.width <= r.width - 4 && q.height >= 24; });
    const center = r.left + r.width / 2;
    let bad = 0;
    for (const k of items) { const q = k.getBoundingClientRect(); if (Math.abs(q.left + q.width / 2 - center) > 2) bad++; }
    if (items.length >= 3 && bad / items.length > .5) out.offcenter.push({ what: `items in rail ${name(rail)}`, detail: `${bad}/${items.length} icons off the rail's center line`, ...box(rail) });
  }

  // textoffcenter: one line of text in a fixed-height control or row (18–64px tall) off its vertical middle.
  for (const e of document.querySelectorAll('button, a, [role=button], [role=tab], [role=menuitem], [role=option], [role=treeitem], li, input, h1, h2, h3')) {
    if (!shown(e)) continue;
    const r = e.getBoundingClientRect();
    if (r.height < 18 || r.height > 64 || r.width < 30) continue;
    let text = null;
    if (e.matches('input')) continue;
    const walker = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
    const lines = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.nodeValue.trim() || !shown(n.parentElement)) continue;
      const range = document.createRange(); range.selectNodeContents(n);
      for (const q of range.getClientRects()) if (q.width > 2) lines.push(q);
    }
    if (!lines.length) continue;
    const top = Math.min(...lines.map(q => q.top)), bottom = Math.max(...lines.map(q => q.bottom));
    if (bottom - top > r.height * .8 || bottom - top > 28) continue;   // several lines, or text that fills the box
    text = (top + bottom) / 2;
    const c = getComputedStyle(e);
    const padTop = parseFloat(c.paddingTop) || 0, padBottom = parseFloat(c.paddingBottom) || 0;
    if (Math.abs(padTop - padBottom) > 4) continue;  // deliberately uneven padding (a label above a rule)
    const dy = text - (r.top + r.height / 2);
    if (Math.abs(dy) > 3) out.textoffcenter.push({ what: `"${label(e)}" ${name(e)}`, detail: `text ${Math.round(dy)}px off middle of a ${Math.round(r.height)}px box`, ...box(e) });
  }

  // overlap: text lines from different elements drawing over each other.
  const lines = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n && lines.length < 900; n = walker.nextNode()) {
    const t = n.nodeValue.trim(); const el = n.parentElement;
    if (t.length < 2 || !el || !shown(el) || el.closest('script,style,noscript,[aria-hidden=true]')) continue;
    const range = document.createRange(); range.selectNodeContents(n);
    for (const q of range.getClientRects()) if (q.width > 4 && q.height > 6 && q.top < H && q.bottom > 0) lines.push({ q, el, t: t.slice(0, 30) });
  }
  for (let i = 0; i < lines.length; i++) for (let j = i + 1; j < lines.length; j++) {
    const a = lines[i], b = lines[j];
    if (a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el)) continue;
    const ox = Math.min(a.q.right, b.q.right) - Math.max(a.q.left, b.q.left), oy = Math.min(a.q.bottom, b.q.bottom) - Math.max(a.q.top, b.q.top);
    if (ox > 6 && oy > Math.min(a.q.height, b.q.height) * .4) {
      // Text that sits on another layer on purpose (a caption over a picture) is drawn by a positioned ancestor; it only
      // counts when both lines are in normal flow.
      out.overlap.push({ what: `"${a.t}" / "${b.t}"`, detail: `${name(a.el)} over ${name(b.el)}`, ...box(null, a.q) });
      if (out.overlap.length > 30) break;
    }
  }
  out.lowcontrast = net19Contrast();
  return out;
}

// lowcontrast: text as it is actually shown, after every CSS filter on the way (palette.js's page flip and the
// turned-back photos inside it), measured against what is painted behind it. Reports:
//  - text below a 3:1 contrast ratio with the surface behind it (dark text on a dark page, a faint placeholder);
//  - text flipped over a picture kept in its real colors, or the other way round (white text made dark over a photo);
//  - a text caret the same color as the surface it blinks on.
// Each item is { what, detail, x, y, w, h }.
function net19Contrast() {
  const out = [], seen = new Set();
  const W = innerWidth, H = innerHeight;
  let pen = null;
  const parse = c => {
    c = String(c || '');
    let m = c.match(/^rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:[, /]+([\d.]+%?))?\)$/);
    if (m) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : +m[4]];
    if (!c || c === 'transparent' || c === 'none') return [0, 0, 0, 0];
    try {
      pen ||= new OffscreenCanvas(1, 1).getContext('2d', { willReadFrequently: true });
      pen.clearRect(0, 0, 1, 1); pen.fillStyle = '#000'; pen.fillStyle = c; pen.fillRect(0, 0, 1, 1);
      const d = pen.getImageData(0, 0, 1, 1).data;
      return d[3] ? [d[0] * 255 / d[3], d[1] * 255 / d[3], d[2] * 255 / d[3], d[3] / 255] : [0, 0, 0, 0];
    } catch { return null; }
  };
  const lin = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; };
  const L = ([r, g, b]) => .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b);
  const ratio = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };
  const over = (top, under) => { const a = top[3]; return [0, 1, 2].map(i => top[i] * a + under[i] * (1 - a)).concat(1); };
  // Filters: each invert() on an element or its ancestors turns what it draws over; count them to know whether a color is
  // shown as written or inverted (hue-rotate and mild contrast barely move lightness).
  const flips = new Map();
  const parity = el => {
    if (!el || el.nodeType !== 1) return 0;
    if (flips.has(el)) return flips.get(el);
    const f = getComputedStyle(el).filter;
    let p = parity(el.parentElement || el.getRootNode()?.host);
    const m = f && f !== 'none' && f.match(/invert\(([\d.]+)\)/);
    if (m && +m[1] > .5) p ^= 1;
    flips.set(el, p); return p;
  };
  const shownAs = (c, p) => p ? [255 - c[0], 255 - c[1], 255 - c[2], c[3]] : c;
  const alpha = el => { let a = 1; for (let n = el; n && n.nodeType === 1; n = n.parentElement) a *= +getComputedStyle(n).opacity; return a; };
  const name = e => (e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '')).slice(0, 60);
  let layerList = null;
  const layers = () => layerList ||= [...document.querySelectorAll('body *')].filter(e => {
    const q = e.getBoundingClientRect();
    return q.width >= 300 && q.height >= 300 && getComputedStyle(e).pointerEvents === 'none' && /url\(/.test(getComputedStyle(e).backgroundImage);
  });
  // What is painted behind a point: the first element under `el` in the hit stack with an opaque color, a picture or a canvas.
  const behind = (el, x, y) => {
    const stack = document.elementsFromPoint(x, y);
    let i = stack.indexOf(el); if (i < 0) i = stack.findIndex(s => s.contains(el));
    let color = null, painter = null;
    for (const s of stack.slice(Math.max(0, i))) {
      if (s !== el && el.contains(s)) continue;
      const c = getComputedStyle(s);
      if (/^(IMG|VIDEO|CANVAS|IFRAME|EMBED|OBJECT)$/.test(s.tagName) || /url\(/.test(c.backgroundImage)) return { picture: s };
      const bg = parse(c.backgroundColor);
      if (!bg || bg[3] < .05) continue;
      color = color ? over(color, shownAs(bg, parity(s))) : shownAs(bg, parity(s));
      painter ||= s;
      if (bg[3] >= .95) return { color, painter };
    }
    // Hit testing skips layers with pointer-events:none, such as a background photo behind the whole app (Gmail's themes).
    if (!color) for (const layer of layers()) {
      if (layer.contains(el)) continue;
      const q = layer.getBoundingClientRect();
      if (x >= q.left && x <= q.right && y >= q.top && y <= q.bottom) return { picture: layer };
    }
    // Nothing opaque: the browser's own canvas, white unless the page asks for a dark one (and flipped with the root).
    const dark = getComputedStyle(document.documentElement).colorScheme.includes('dark') && !getComputedStyle(document.documentElement).colorScheme.includes('light');
    const base = shownAs(dark ? [18, 18, 18, 1] : [255, 255, 255, 1], parity(document.documentElement));
    return { color: color ? over(color, base) : base, painter: painter || document.documentElement };
  };
  const report = (el, detail, r) => {
    const k = name(el) + detail.split(' ')[0] + Math.round(r.left / 40) + ',' + Math.round(r.top / 20);
    if (seen.has(k) || out.length > 60) return; seen.add(k);
    out.push({ what: `"${(el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40)}" ${name(el)}`, detail, x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) });
  };
  const judge = (el, colorText, r, what = 'text') => {
    const x = Math.min(W - 1, Math.max(0, r.left + Math.min(r.width / 2, 12))), y = Math.min(H - 1, Math.max(0, r.top + r.height / 2));
    const b = behind(el, x, y);
    const tp = parity(el);
    if (b.picture) {
      const shadow = getComputedStyle(el).textShadow;
      if (parity(b.picture) !== tp && b.picture.getBoundingClientRect().width > 200) report(el, `${what} ${tp ? 'inverted' : 'as drawn'} over a picture shown ${tp ? 'as drawn' : 'inverted'}${shadow !== 'none' ? ' (the site gave it a shadow for that picture)' : ''}`, r);
      return;
    }
    let t = parse(colorText); if (!t) return;
    t = [...t.slice(0, 3), t[3] * alpha(el)];
    const shown = over(shownAs(t, tp), b.color);
    const cr = ratio(shown, b.color);
    if (cr < 3) report(el, `${what} contrast ${cr.toFixed(2)}:1 (${shown.slice(0, 3).map(Math.round)} on ${b.color.slice(0, 3).map(Math.round)})`, r);
  };
  const visible = e => { const c = getComputedStyle(e); return c.visibility === 'visible' && c.display !== 'none' && +c.opacity > .05; };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n = 0;
  for (let t = walker.nextNode(); t && n < 1500; t = walker.nextNode()) {
    const el = t.parentElement;
    if (!el || t.nodeValue.trim().length < 2 || el.closest('script,style,noscript,[aria-hidden=true],svg')) continue;
    const range = document.createRange(); range.selectNodeContents(t);
    const r = [...range.getClientRects()].find(q => q.width > 4 && q.height > 6 && q.bottom > 0 && q.right > 0 && q.top < H && q.left < W);
    if (!r || !visible(el)) continue;
    n++;
    const c = getComputedStyle(el);
    judge(el, c.webkitTextFillColor && c.webkitTextFillColor !== c.color && parse(c.webkitTextFillColor)?.[3] ? c.webkitTextFillColor : c.color, r);
  }
  // Empty fields show their placeholder; typed text and the caret use the field's color and caret-color.
  for (const f of document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=range]):not([type=color]), textarea')) {
    const r = f.getBoundingClientRect();
    if (r.width < 20 || r.height < 10 || r.bottom < 0 || r.top > H || !visible(f)) continue;
    const c = getComputedStyle(f);
    if (!f.value && f.placeholder) judge(f, getComputedStyle(f, '::placeholder').color, r, 'placeholder');
    else if (f.value) judge(f, c.color, r, 'typed text');
    judge(f, c.caretColor === 'auto' ? c.color : c.caretColor, r, 'caret');
  }
  // Editors that draw their own caret (Google Docs, code editors): a thin element named like a cursor.
  for (const k of document.querySelectorAll('[class*="cursor-caret" i], [class*="caret" i]:not(input), .cursor')) {
    const r = k.getBoundingClientRect();
    if (r.width > 4 || r.height < 8 || !visible(k)) continue;
    const c = getComputedStyle(k);
    const col = parse(c.borderLeftColor)?.[3] && parseFloat(c.borderLeftWidth) ? c.borderLeftColor : c.backgroundColor;
    const b = behind(k, r.left + r.width / 2, r.top + r.height / 2);
    if (b.picture) {
      if (parity(b.picture) !== parity(k)) report(k, `caret ${parity(k) ? 'inverted' : 'as drawn'} over a canvas shown ${parity(b.picture) ? 'inverted' : 'as drawn'}`, r);
      continue;
    }
    const cr = ratio(shownAs(parse(col), parity(k)), b.color);
    if (cr < 3) report(k, `caret contrast ${cr.toFixed(2)}:1`, r);
  }
  return out;
}
if (typeof module !== 'undefined') module.exports = { net19PageChecks };
