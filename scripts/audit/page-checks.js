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
  const clipped = (e, x, y) => { for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) { const c = getComputedStyle(a);
    if (/auto|scroll|hidden|clip/.test(c.overflowX + c.overflowY)) { const q = a.getBoundingClientRect(); if (x < q.left || x > q.right || y < q.top || y > q.bottom) return true; } } return false; };
  const within = (hit, e) => !!hit && (hit === e || e.contains(hit) || (hit.getRootNode() !== document && e.contains(hit.getRootNode().host)));

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
      if (field && hit && (hit.closest('label')?.contains(e) || (hit.tagName === 'LABEL' && hit.htmlFor === e.id))) continue;
      if (!field && hit && hit.closest('a[href], button, [role=button]') && hit.closest('a[href], button, [role=button]').parentElement?.contains(e)) continue;
      out.covered.push({ what: `${field ? 'field' : 'control'} "${label(e)}" ${name(e)}`, detail: `covered by ${hit ? name(hit) : 'nothing (outside page)'}`, ...box(e) });
      break;
    }
  }

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
    if (bottom - top > r.height * .8 || bottom - top > 28) continue;
    let t0 = top, b0 = bottom;
    for (const k of e.querySelectorAll('svg, img, [class*="icon" i]')) {
      if (!shown(k)) continue;
      const q = k.getBoundingClientRect();
      if (q.width < 8 || q.height < 8 || q.height > r.height) continue;
      if (q.bottom <= top + 1 || q.top >= bottom - 1) { t0 = Math.min(t0, q.top); b0 = Math.max(b0, q.bottom); }
    }
    text = (t0 + b0) / 2;
    const c = getComputedStyle(e);
    const padTop = parseFloat(c.paddingTop) || 0, padBottom = parseFloat(c.paddingBottom) || 0;
    if (Math.abs(padTop - padBottom) > 4) continue;
    const dy = text - (r.top + r.height / 2);
    if (Math.abs(dy) > 3) out.textoffcenter.push({ what: `"${label(e)}" ${name(e)}`, detail: `text ${Math.round(dy)}px off middle of a ${Math.round(r.height)}px box`, ...box(e) });
  }

  for (const f of document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=range]):not([type=color]):not([type=submit]):not([type=button]), textarea')) {
    if (!shown(f)) continue;
    const r = f.getBoundingClientRect(), c = getComputedStyle(f);
    if (r.height > 80 || r.width < 40) continue;
    if ((parseFloat(c.paddingTop) || 0) - (parseFloat(c.paddingBottom) || 0) > 8) continue;
    const bt = parseFloat(c.borderTopWidth) || 0, bb = parseFloat(c.borderBottomWidth) || 0, pt = parseFloat(c.paddingTop) || 0, pb = parseFloat(c.paddingBottom) || 0;
    const lh = parseFloat(c.lineHeight) || parseFloat(c.fontSize) * 1.2;
    const line = f.tagName === 'TEXTAREA' ? r.top + bt + pt + lh / 2 : r.top + bt + pt + (r.height - bt - bb - pt - pb) / 2;
    let frame = null;
    for (let e = f, i = 0; e && i < 6; e = e.parentElement, i++) {
      const s = getComputedStyle(e), q = e.getBoundingClientRect();
      if (q.height > 90) break;
      const drawn = (parseFloat(s.borderTopWidth) > 0 && s.borderTopStyle !== 'none') || (s.boxShadow !== 'none') || ((s.backgroundColor.match(/[\d.]+/g) || [0, 0, 0, 0])[3] ?? 1) > 0;
      if (drawn && q.height >= r.height - 2 && q.height >= 24) { frame = e; break; }
    }
    if (!frame) continue;
    const q = frame.getBoundingClientRect();
    const dy = line - (q.top + q.height / 2);
    if (Math.abs(dy) > 3) out.textoffcenter.push({ what: `field "${label(f)}" ${name(f)}`, detail: `typed line ${Math.round(dy)}px off middle of its ${Math.round(q.height)}px box ${name(frame)}`, ...box(f) });
  }

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
      out.overlap.push({ what: `"${a.t}" / "${b.t}"`, detail: `${name(a.el)} over ${name(b.el)}`, ...box(null, a.q) });
      if (out.overlap.length > 30) break;
    }
  }
  out.lowcontrast = net19Contrast();
  out.dim = net19Dim();
  out.cropped = net19Cropped();
  return out;
}

function net19Cropped() {
  const out = [], W = innerWidth, H = innerHeight;
  const up = e => e.parentElement || (e.parentNode && e.parentNode.host) || null;
  const name = e => (e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '')).slice(0, 60);
  const text = e => (e.getAttribute('aria-label') || e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 30);
  const visible = (e, r) => { const c = getComputedStyle(e); return r.width > 1 && r.height > 1 && r.bottom > 0 && r.right > 0 && r.top < H && r.left < W && c.visibility === 'visible' && +c.opacity > .05; };
  const shownPart = (e, r) => {
    let left = r.left, top = r.top, right = r.right, bottom = r.bottom;
    for (let a = up(e); a && a !== document.documentElement; a = up(a)) {
      if (!(a instanceof Element)) continue;
      const c = getComputedStyle(a);
      if (c.position === 'fixed') break;
      const q = a.getBoundingClientRect();
      if (/hidden|clip/.test(c.overflowX)) { left = Math.max(left, q.left); right = Math.min(right, q.right); }
      if (/hidden|clip/.test(c.overflowY)) { top = Math.max(top, q.top); bottom = Math.min(bottom, q.bottom); }
    }
    return Math.max(0, right - left) * Math.max(0, bottom - top) / (r.width * r.height);
  };
  const seen = new Set();
  const report = (e, detail, r) => { const k = name(e) + detail; if (seen.has(k) || out.length >= 40) return; seen.add(k); out.push({ what: `${name(e)} "${text(e) || text(up(e) || e)}"`, detail, x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) }); };
  const walk = root => {
    for (const e of root.querySelectorAll('*')) {
      if (e.shadowRoot) walk(e.shadowRoot);
      const r = e.getBoundingClientRect();
      if (r.width < 6 || r.height < 6 || !visible(e, r)) continue;
      const c = getComputedStyle(e);
      const icon = (e.tagName === 'svg' || e.tagName === 'IMG' || /url\(/.test(c.backgroundImage) || /url\(/.test(c.maskImage || c.webkitMaskImage || '')) && r.width <= 48 && r.height <= 48 && !(e.tagName === 'svg' && up(e)?.tagName === 'svg');
      if (icon) {
        const part = shownPart(e, r);
        if (part > .05 && part < .85) report(e, `icon cut to ${Math.round(part * 100)}% by an ancestor`, r);
        if (/url\(/.test(c.backgroundImage) && !/repeat(?!-)/.test(c.backgroundRepeat.replace('no-repeat', ''))) {
          const [bw, bh] = c.backgroundSize.split(' ').map(v => /px$/.test(v) ? parseFloat(v) : NaN);
          const sprite = /-\d/.test(c.backgroundPosition) || bw > r.width * 1.6 || (bh || bw) > r.height * 1.6;
          if (!sprite && (bw > r.width + 1.5 || (bh || bw) > r.height + 1.5)) report(e, `background icon ${bw}x${bh || bw} in a ${Math.round(r.width)}x${Math.round(r.height)} box`, r);
        }
        continue;
      }
      if (/^(INPUT|TEXTAREA)$/.test(e.tagName) && !/^(checkbox|radio|range|color|file|hidden|image|submit|button|reset)$/.test(e.type)) {
        const size = parseFloat(c.fontSize), inner = e.clientHeight - parseFloat(c.paddingTop) - parseFloat(c.paddingBottom);
        if (e.tagName === 'INPUT' && inner > 0 && inner < size * 1.05) report(e, `text ${size}px tall in a ${Math.round(inner)}px field`, r);
        continue;
      }
      const own = [...e.childNodes].some(n => n.nodeType === 3 && n.nodeValue.trim());
      if (!own || r.height > 64 || c.clip !== 'auto' || c.clipPath !== 'none' || r.width < 16 && r.height < 16) continue;
      const clamp = c.webkitLineClamp && c.webkitLineClamp !== 'none';
      if (/hidden|clip/.test(c.overflowX) && c.textOverflow !== 'ellipsis' && !clamp && e.scrollWidth > e.clientWidth + 2 && c.whiteSpace !== 'normal') report(e, `text ${e.scrollWidth}px wide cut to ${e.clientWidth}px`, r);
      else if (/hidden|clip/.test(c.overflowY) && !clamp && e.scrollHeight > e.clientHeight + 3 && e.clientHeight < parseFloat(c.fontSize) * 1.6) report(e, `text ${e.scrollHeight}px tall cut to ${e.clientHeight}px`, r);
    }
  };
  walk(document);
  return out;
}

function net19Dim() {
  if (matchMedia('(prefers-color-scheme: dark)').matches) return [];
  const shown = [];
  for (const [fx, fy] of [[.5, .5], [.3, .4], [.7, .4], [.5, .8], [.2, .7], [.8, .7], [.15, .2], [.85, .2]]) {
    const x = innerWidth * fx, y = innerHeight * fy;
    const pixels = window.net19ShownBackground?.(x, y);
    if (pixels) shown.push(pixels);
  }
  if (!shown.length) return [];
  const light = shown.map(([r, g, b]) => (.2126 * r + .7152 * g + .0722 * b) / 255).sort((a, b) => a - b);
  const middle = light[light.length >> 1];
  return middle > .3 && middle < .86 ? [{ what: 'page background', detail: `shows at lightness ${middle.toFixed(2)} in light mode: grey and dim instead of the 2019 page color`, x: 0, y: 0, w: innerWidth, h: innerHeight }] : [];
}

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
  const chains = new Map();
  const chainOf = filter => chains.get(filter) || chains.set(filter, parseChain(filter)).get(filter);
  const parseChain = filter => [...String(filter || '').matchAll(/(invert|hue-rotate|contrast|brightness)\(([-\d.]+)(deg|%)?\)/g)].map(([, fn, v, unit]) => [fn, unit === '%' ? v / 100 : +v]);
  const hueMatrix = deg => { const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
    return [[.213 + c * .787 - s * .213, .715 - c * .715 - s * .715, .072 - c * .072 + s * .928], [.213 - c * .213 + s * .143, .715 + c * .285 + s * .14, .072 - c * .072 - s * .283], [.213 - c * .213 - s * .787, .715 - c * .715 + s * .715, .072 + c * .928 + s * .072]]; };
  const applyChain = (rgb, chain) => {
    let v = rgb.map(x => x / 255);
    for (const [fn, n] of chain) {
      if (fn === 'invert') v = v.map(x => x * (1 - n) + (1 - x) * n);
      else if (fn === 'hue-rotate') { const m = hueMatrix(n); v = m.map(row => row[0] * v[0] + row[1] * v[1] + row[2] * v[2]); }
      else if (fn === 'contrast') v = v.map(x => (x - .5) * n + .5);
      else if (fn === 'brightness') v = v.map(x => x * n);
      v = v.map(x => Math.min(1, Math.max(0, x)));
    }
    return v.map(x => Math.round(255 * x));
  };
  const flip = ([r, g, b, a]) => applyChain([r, g, b], chainOf(getComputedStyle(document.documentElement).filter)).concat(a);
  const shownAs = (c, p) => p ? flip(c) : c;
  const alpha = el => { let a = 1; for (let n = el; n && n.nodeType === 1; n = n.parentElement) a *= +getComputedStyle(n).opacity; return a; };
  const name = e => (e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '')).slice(0, 60);
  let layerList = null;
  const layers = () => layerList ||= [...document.querySelectorAll('body *')].filter(e => {
    const q = e.getBoundingClientRect();
    if (q.width < 200 || q.height < 200) return false;
    const c = getComputedStyle(e);
    return c.pointerEvents === 'none' && (/^(IMG|VIDEO|CANVAS)$/.test(e.tagName) || /url\(/.test(c.backgroundImage)) ||
      e.tagName === 'CANVAS' && c.visibility === 'visible';
  });
  const hidden = (x, y, stack, above) => layers().find(l => {
    if (stack.includes(l) || l.contains(above)) return false;
    const q = l.getBoundingClientRect();
    if (!(x >= q.left && x <= q.right && y >= q.top && y <= q.bottom)) return false;
    for (let a = l.parentElement; a && a !== document.body; a = a.parentElement) {
      const c = getComputedStyle(a);
      if (/hidden|clip|auto|scroll/.test(c.overflowX + c.overflowY)) { const b = a.getBoundingClientRect(); if (x < b.left || x > b.right || y < b.top || y > b.bottom) return false; }
    }
    return true;
  });
  const behind = (el, x, y) => {
    const stack = document.elementsFromPoint(x, y);
    let i = stack.indexOf(el);
    if (i < 0 && getComputedStyle(el).pointerEvents !== 'none' && stack[0] && !el.contains(stack[0])) return { covered: true };
    if (i < 0) i = stack.findIndex(s => s.contains(el));
    let color = null, painter = null, shade = null;
    for (const s of stack.slice(Math.max(0, i))) {
      if (s !== el && el.contains(s)) continue;
      const c = getComputedStyle(s);
      if (/^(IMG|VIDEO|CANVAS|IFRAME|EMBED|OBJECT)$/.test(s.tagName) || /url\(/.test(c.backgroundImage)) return { picture: s, shade };
      if (/gradient\(/.test(c.backgroundImage)) {
        shade ||= s;
        const stops = (c.backgroundImage.match(/rgba?\([^)]*\)/g) || []).map(parse).filter(Boolean);
        if (stops.length) {
          const avg = [0, 1, 2, 3].map(k => stops.reduce((sum, v) => sum + v[k], 0) / stops.length);
          if (avg[3] >= .05) color = color ? over(color, shownAs(avg, parity(s))) : shownAs(avg, parity(s));
          painter ||= s;
        }
      }
      const bg = parse(c.backgroundColor);
      if (!bg || bg[3] < .05) continue;
      const pic = !color && hidden(x, y, stack, el);
      if (pic && s.contains(pic)) return { picture: pic, shade };
      color = color ? over(color, shownAs(bg, parity(s))) : shownAs(bg, parity(s));
      painter ||= s;
      if (bg[3] >= .95) return { color, painter };
    }
    if (!color) { const pic = hidden(x, y, stack, el); if (pic) return { picture: pic, shade }; }
    const dark = getComputedStyle(document.documentElement).colorScheme.includes('dark') && !getComputedStyle(document.documentElement).colorScheme.includes('light');
    const base = shownAs(dark ? [18, 18, 18, 1] : [255, 255, 255, 1], parity(document.documentElement));
    return { color: color ? over(color, base) : base, painter: painter || document.documentElement };
  };
  window.net19ShownBackground = (x, y) => { const top = document.elementFromPoint(x, y); const b = top && behind(top, x, y); return b && !b.covered && !b.picture ? b.color : null; };
  const report = (el, detail, r) => {
    const k = name(el) + detail.split(' ')[0] + Math.round(r.left / 40) + ',' + Math.round(r.top / 20);
    if (seen.has(k) || out.length > 60) return; seen.add(k);
    out.push({ what: `"${(el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40)}" ${name(el)}`, detail, x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) });
  };
  const judge = (el, colorText, r, what = 'text') => {
    const x = Math.min(W - 1, Math.max(0, r.left + Math.min(r.width / 2, 12))), y = Math.min(H - 1, Math.max(0, r.top + r.height / 2));
    const b = behind(el, x, y);
    if (b.covered) return;
    const tp = parity(el);
    if (b.picture) {
      const shadow = getComputedStyle(el).textShadow;
      if (b.shade && parity(b.shade) !== parity(b.picture) && b.picture.getBoundingClientRect().width > 200) { report(el, `text over a picture whose shade is ${parity(b.shade) ? 'inverted' : 'as drawn'} and the picture ${parity(b.picture) ? 'inverted' : 'as drawn'}`, r); return; }
      if (parity(b.picture) !== tp && b.picture.getBoundingClientRect().width > 200) report(el, `${what} ${tp ? 'inverted' : 'as drawn'} over a picture shown ${tp ? 'as drawn' : 'inverted'}${shadow !== 'none' ? ' (the site gave it a shadow for that picture)' : ''}`, r);
      return;
    }
    let t = parse(colorText); if (!t) return;
    const a = alpha(el);
    if (a < .1 || t[3] < .1) return;
    t = [...t.slice(0, 3), t[3] * a];
    const shown = over(shownAs(t, tp), b.color);
    const cr = ratio(shown, b.color);
    const st = getComputedStyle(el), size = parseFloat(st.fontSize), large = what === 'text' && (size >= 24 || (size >= 18.6 && +st.fontWeight >= 600));
    const chroma = c => Math.max(...c.slice(0, 3)) - Math.min(...c.slice(0, 3));
    if (cr < (large ? 2.2 : chroma(b.color) > 90 || chroma(shown) > 90 ? 2.5 : 3)) report(el, `${what} contrast ${cr.toFixed(2)}:1 (${shown.slice(0, 3).map(Math.round)} on ${b.color.slice(0, 3).map(Math.round)})`, r);
  };
  const clippedAway = e => {
    for (let n = e, i = 0; n && n !== document.body && i < 4; n = n.parentElement, i++) {
      const c = getComputedStyle(n);
      if (/rect\(0(px)?,? 0(px)?,? 0(px)?,? 0(px)?\)|rect\(1px,? 1px,? 1px,? 1px\)/.test(c.clip) || /inset\(50%\)|inset\(100%\)|circle\(0/.test(c.clipPath)) return true;
      if (/hidden|clip/.test(c.overflow) && (n.offsetWidth <= 2 || n.offsetHeight <= 2)) return true;
    }
    return false;
  };
  const visible = e => { const c = getComputedStyle(e); return c.visibility === 'visible' && c.display !== 'none' && +c.opacity > .05 && !clippedAway(e); };
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
  for (const f of document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=range]):not([type=color]):not([type=submit]):not([type=button]):not([type=image]):not([type=reset]), textarea')) {
    const r = f.getBoundingClientRect();
    if (r.width < 20 || r.height < 10 || r.bottom < 0 || r.top > H || !visible(f)) continue;
    const c = getComputedStyle(f);
    if (!f.value && f.placeholder) judge(f, getComputedStyle(f, '::placeholder').color, r, 'placeholder');
    else if (f.value) judge(f, c.color, r, 'typed text');
    judge(f, c.caretColor === 'auto' ? c.color : c.caretColor, r, 'caret');
  }
  for (const k of document.querySelectorAll('[class*="cursor-caret" i], [class*="caret" i]:not(input), .cursor')) {
    const r = k.getBoundingClientRect();
    if (r.width > 4 || r.height < 8 || !visible(k)) continue;
    const c = getComputedStyle(k);
    const col = parse(c.borderLeftColor)?.[3] && parseFloat(c.borderLeftWidth) ? c.borderLeftColor : c.backgroundColor;
    const b = behind(k, r.left + r.width / 2, r.top + r.height / 2);
    if (b.covered) continue;
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
