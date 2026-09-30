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
  Object.assign(out, net19Layout());
  Object.assign(out, net19Rows());
  Object.assign(out, net19Rhythm());
  Object.assign(out, net19Badges());
  const reach = net19Reach(lines);
  out.overlap.push(...reach.overdrawn);
  out.btnsize = reach.btnsize;
  out.scrollreach = reach.scrollreach;
  return out;
}

function net19Reach(lines) {
  const W = innerWidth, H = innerHeight;
  const found = { btnsize: [], scrollreach: [], overdrawn: [] };
  const up = e => e.parentElement || (e.parentNode && e.parentNode.host) || null;
  const name = e => (e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '')).slice(0, 60);
  const label = e => (e.getAttribute?.('aria-label') || e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 30);
  const box = r => ({ x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) });
  const all = [];
  const collect = root => { for (const e of root.querySelectorAll('*')) { all.push(e); if (e.shadowRoot) collect(e.shadowRoot); } };
  collect(document);
  const styleOf = new Map(), rectOf = new Map();
  const cs = e => styleOf.get(e) || styleOf.set(e, getComputedStyle(e)).get(e);
  const rect = e => rectOf.get(e) || rectOf.set(e, e.getBoundingClientRect()).get(e);
  const onScreen = r => r.width > 1 && r.height > 1 && r.bottom > 0 && r.right > 0 && r.top < H && r.left < W;
  const seenEl = e => { if (!onScreen(rect(e))) return false; for (let n = e; n && n.nodeType === 1; n = up(n)) { const c = cs(n); if (c.display === 'none' || c.visibility !== 'visible' && n === e || +c.opacity < .05) return false; } return true; };
  const inPopup = e => { for (let n = e; n && n.nodeType === 1; n = up(n)) if (n.matches('[role=dialog], [role=menu], [role=listbox], [role=tooltip], dialog')) return true; return false; };
  const alphaOf = c => { const m = String(c).match(/[\d.]+/g); return !m ? 0 : m.length > 3 ? +m[3] : 1; };
  const filled = e => { const c = cs(e); return alphaOf(c.backgroundColor) > .5 || /url\(|gradient/.test(c.backgroundImage) || ['Top', 'Bottom'].every(s => parseFloat(c[`border${s}Width`]) >= 1 && c[`border${s}Style`] !== 'none' && alphaOf(c[`border${s}Color`]) > .3); };
  const face = e => { if (filled(e)) return rect(e); const r = rect(e); for (const k of e.children) { const q = rect(k); if (filled(k) && q.width >= r.width * .9 && q.height >= r.height * .6) return q; } return null; };
  const ancestors = e => { const list = []; for (let n = up(e); n && n.nodeType === 1 && list.length < 6; n = up(n)) list.push(n); return list; };

  const buttons = all.filter(e => e.matches('button, [role=button], a[href]') && !up(e)?.closest?.('button, [role=button]') && seenEl(e) && !inPopup(e))
    .map(e => ({ e, f: face(e) })).filter(b => b.f && b.f.height >= 16 && b.f.height <= 64 && b.f.width >= 24 && b.f.width <= 400 && label(b.e)).slice(0, 400);
  const reported = new Set();
  for (let i = 0; i < buttons.length; i++) for (let j = i + 1; j < buttons.length; j++) {
    const a = buttons[i], b = buttons[j];
    if (a.e.contains(b.e) || b.e.contains(a.e)) continue;
    const [l, r] = a.f.left <= b.f.left ? [a, b] : [b, a];
    const gapX = r.f.left - l.f.right, overlapY = Math.min(a.f.bottom, b.f.bottom) - Math.max(a.f.top, b.f.top);
    if (gapX < -2 || gapX > 40 || overlapY < Math.min(a.f.height, b.f.height) * .5) continue;
    const shared = ancestors(a.e).find(n => n.contains(b.e) || n.shadowRoot?.contains(b.e));
    if (!shared || ancestors(b.e).indexOf(shared) < 0) continue;
    const dh = b.f.height - a.f.height, dc = (b.f.top + b.f.height / 2) - (a.f.top + a.f.height / 2);
    if (Math.abs(dh) <= 3 && Math.abs(dc) <= 3) continue;
    const key = name(l.e) + label(l.e) + '|' + name(r.e) + label(r.e);
    if (reported.has(key) || found.btnsize.length >= 30) continue;
    reported.add(key);
    found.btnsize.push({ what: `"${label(l.e)}" ${name(l.e)} / "${label(r.e)}" ${name(r.e)}`, detail: `side-by-side buttons ${Math.round(l.f.height)}px and ${Math.round(r.f.height)}px tall, middles ${Math.abs(Math.round(dc))}px apart in ${name(shared)}`, ...box({ left: l.f.left, top: Math.min(l.f.top, r.f.top), width: r.f.right - l.f.left, height: Math.max(l.f.bottom, r.f.bottom) - Math.min(l.f.top, r.f.top) }) });
  }

  const page = document.scrollingElement || document.documentElement;
  const pageLeft = Math.max(0, page.scrollHeight - page.clientHeight - page.scrollTop);
  const pinned = e => { for (let n = e; n && n.nodeType === 1; n = up(n)) if (cs(n).position === 'fixed') return true; return false; };
  for (const e of all) {
    const c = cs(e), r = rect(e);
    const frame = e.tagName === 'IFRAME' && r.width >= 150 && r.height >= 150;
    const scroller = /auto|scroll/.test(c.overflowY) && e.scrollHeight > e.clientHeight + 2 && r.height >= 60 && r.width >= 60 && !/^(BODY|HTML)$/.test(e.tagName);
    if (!frame && !scroller || r.top > H - 40 || r.bottom < 40 || !seenEl(e) || inPopup(e)) continue;
    const what = `${frame ? 'frame' : 'scroll box'} ${name(e)}`;
    let cut = null;
    for (let n = up(e); n && n.nodeType === 1 && !/^(BODY|HTML)$/.test(n.tagName); n = up(n)) {
      const nc = cs(n);
      if (!/hidden|clip/.test(nc.overflowY)) continue;
      const q = rect(n);
      if (q.bottom < r.bottom - 2 && q.bottom > r.top + 20) { cut = `its bottom ${Math.round(r.bottom - q.bottom)}px is clipped off by ${name(n)}`; break; }
    }
    if (!cut && r.bottom > H + 2) {
      const stuck = pinned(e);
      const short = r.bottom - H - (stuck ? 0 : pageLeft);
      if (short > 2) cut = `its bottom lies ${Math.round(short)}px below the ${stuck ? 'window on a fixed panel' : 'end of the page'} and can never be scrolled into view`;
    }
    if (cut && found.scrollreach.length < 20) found.scrollreach.push({ what, detail: cut, ...box({ left: r.left, top: Math.max(0, r.bottom - 40), width: r.width, height: 40 }) });
  }

  for (const b of buttons.filter(b => b.e.matches('button, [role=button]'))) {
    const f = b.f;
    const under = lines.find(t => {
      if (b.e.contains(t.el) || t.el.contains(b.e) || (t.el.getRootNode() !== document && b.e.contains(t.el.getRootNode().host))) return false;
      const ox = Math.min(f.right, t.q.right) - Math.max(f.left, t.q.left), oy = Math.min(f.bottom, t.q.bottom) - Math.max(f.top, t.q.top);
      if (ox < 4 || oy < Math.max(4, t.q.height * .3)) return false;
      const x = Math.max(f.left, t.q.left) + ox / 2, y = Math.max(f.top, t.q.top) + oy / 2;
      let top = document.elementFromPoint(x, y); while (top && top.shadowRoot) { const inner = top.shadowRoot.elementFromPoint(x, y); if (!inner || inner === top) break; top = inner; }
      return !!top && (b.e === top || b.e.contains(top) || top.getRootNode() !== document && b.e.contains(top.getRootNode().host));
    });
    if (under) found.overdrawn.push({ what: `button "${label(b.e)}" / "${under.t}"`, detail: `${name(b.e)} drawn over the text of ${name(under.el)}`, ...box(f) });
    if (found.overdrawn.length > 20) break;
  }
  const marks = all.filter(e => e.matches('svg, img, [role=img]') && !up(e)?.closest?.('svg') && seenEl(e) && !inPopup(e)).map(e => ({ e, q: rect(e) }))
    .filter(({ q }) => q.width >= 8 && q.height >= 8 && q.width <= 32 && q.height <= 32)
    .map(m => ({ ...m, by: lines.find(t => !t.el.contains(m.e) && Math.min(t.q.bottom, m.q.bottom) - Math.max(t.q.top, m.q.top) > Math.min(t.q.height, m.q.height) * .4 && Math.max(t.q.left - m.q.right, m.q.left - t.q.right) <= 12) }))
    .filter(m => m.by);
  for (const b of buttons.filter(b => b.e.matches('button, [role=button]'))) {
    const f = b.f;
    for (const m of marks) {
      if (b.e.contains(m.e) || m.e.contains(b.e) || b.e.contains(m.by.el) || m.e.getRootNode() !== document && b.e.contains(m.e.getRootNode().host)) continue;
      const ox = Math.min(f.right, m.q.right) - Math.max(f.left, m.q.left), oy = Math.min(f.bottom, m.q.bottom) - Math.max(f.top, m.q.top);
      if (ox < 3 || oy < 3) continue;
      const x = Math.max(f.left, m.q.left) + ox / 2, y = Math.max(f.top, m.q.top) + oy / 2;
      let top = document.elementFromPoint(x, y); while (top && top.shadowRoot) { const inner = top.shadowRoot.elementFromPoint(x, y); if (!inner || inner === top) break; top = inner; }
      if (!top || !(b.e === top || b.e.contains(top) || top.getRootNode() !== document && b.e.contains(top.getRootNode().host))) continue;
      found.overdrawn.push({ what: `button "${label(b.e)}" / ${m.e.tagName.toLowerCase()} beside "${m.by.t}"`, detail: `${name(b.e)} drawn over the ${Math.round(m.q.width)}x${Math.round(m.q.height)} ${name(m.e)} next to ${name(m.by.el)}`, ...box(f) });
      break;
    }
    if (found.overdrawn.length > 20) break;
  }
  return found;
}

function net19Rows() {
  const W = innerWidth, H = innerHeight;
  const found = { clipline: [], rowwrap: [], rowalign: [], spill: [], iconovertext: [], gap: [] };
  const up = e => e.parentElement || (e.parentNode && e.parentNode.host) || null;
  const name = e => (e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '')).slice(0, 60);
  const label = e => (e.getAttribute?.('aria-label') || e.getAttribute?.('placeholder') || e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 30);
  const box = r => ({ x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) });
  const seen = new Set();
  const report = (k, e, detail, r) => { const key = k + name(e) + detail.replace(/[\d.-]+px/g, ''); if (seen.has(key) || found[k].length >= 40) return; seen.add(key); found[k].push({ what: `${name(e)} "${label(e)}"`, detail, ...box(r) }); };
  const all = [];
  const collect = root => { for (const e of root.querySelectorAll('*')) { all.push(e); if (e.shadowRoot) collect(e.shadowRoot); } };
  collect(document);
  const styleOf = new Map(), rectOf = new Map();
  const cs = e => styleOf.get(e) || styleOf.set(e, getComputedStyle(e)).get(e);
  const rect = e => rectOf.get(e) || rectOf.set(e, e.getBoundingClientRect()).get(e);
  const onScreen = r => r.width > 1 && r.height > 1 && r.bottom > 0 && r.right > 0 && r.top < H && r.left < W;
  const deep = root => { const list = []; const walk = r => { for (const e of r.querySelectorAll('*')) { list.push(e); if (e.shadowRoot) walk(e.shadowRoot); } }; walk(root.shadowRoot || root); if (root.shadowRoot) walk(root); return list; };
  const seenEl = e => { if (!onScreen(rect(e))) return false; for (let n = e; n && n.nodeType === 1; n = up(n)) { const c = cs(n); if (c.display === 'none' || c.visibility !== 'visible' && n === e || +c.opacity < .05) return false; } return true; };
  const inPopup = e => { for (let n = e; n && n.nodeType === 1; n = up(n)) if (n.matches('[role=dialog], [role=menu], [role=listbox], [role=tooltip], dialog')) return true; return false; };
  const alphaOf = c => { const m = String(c).match(/[\d.]+/g); return !m ? 0 : m.length > 3 ? +m[3] : 1; };
  const painted = c => alphaOf(c.backgroundColor) > .05 || /url\(|gradient/.test(c.backgroundImage) || c.boxShadow !== 'none' || ['Top', 'Right', 'Bottom', 'Left'].some(s => parseFloat(c[`border${s}Width`]) > 0 && c[`border${s}Style`] !== 'none' && alphaOf(c[`border${s}Color`]) > .1);
  const ringed = c => (['Top', 'Right', 'Bottom', 'Left'].every(s => parseFloat(c[`border${s}Width`]) >= 1 && c[`border${s}Style`] !== 'none' && alphaOf(c[`border${s}Color`]) > .2)) || (c.outlineStyle !== 'none' && parseFloat(c.outlineWidth) >= 1 && alphaOf(c.outlineColor) > .2);
  const textLines = (root, limit = 200) => {
    const lines = [];
    const walk = r => { const t = document.createTreeWalker(r, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
      for (let n = t.nextNode(); n && lines.length < limit; n = t.nextNode()) {
        if (n.nodeType === 1) { if (n.shadowRoot) walk(n.shadowRoot); continue; }
        if (!n.nodeValue.trim() || !n.parentElement || n.parentElement.closest('script,style,noscript')) continue;
        const c = cs(n.parentElement); if (c.visibility !== 'visible' || c.display === 'none') continue;
        const range = document.createRange(); range.selectNodeContents(n);
        for (const q of range.getClientRects()) if (q.width > 2 && q.height > 4) lines.push({ q, el: n.parentElement });
      } };
    walk(root);
    return lines;
  };

  const hiddenInside = (el, outer, q) => { for (let n = el; n && n !== outer; n = up(n)) { if (n.nodeType !== 1) continue; const c = cs(n); if (+c.opacity < .05 || c.clipPath !== 'none' || c.clip !== 'auto') return true; if (/hidden|clip/.test(c.overflowY)) { const b = rect(n); if (q.top >= b.bottom - 3 || q.bottom <= b.top + 3) return true; } } return false; };
  for (const e of all) {
    const c = cs(e);
    if (!/hidden|clip/.test(c.overflowY) || e.tagName === 'BODY' || e.tagName === 'HTML') continue;
    const r = rect(e);
    if (r.height < 10 || r.height > 500 || r.width < 30 || !onScreen(r) || r.bottom > H) continue;
    if (e.scrollHeight <= e.clientHeight + 2 || !seenEl(e)) continue;
    if (c.maskImage && c.maskImage !== 'none' || c.webkitMaskImage && c.webkitMaskImage !== 'none') continue;
    const bottom = r.top + e.clientTop + e.clientHeight;
    const cut = textLines(e).find(({ q, el }) => bottom - q.top > Math.max(3, q.height * .3) && q.bottom - bottom > Math.max(3, q.height * .3) && q.left < r.right && q.right > r.left && !/fixed|absolute/.test(cs(el).position) && !hiddenInside(el, e, q));
    if (cut) report('clipline', e, `a line of "${(cut.el.textContent || '').trim().slice(0, 24)}" cut at ${Math.round(bottom - cut.q.top)}px of its ${Math.round(cut.q.height)}px`, r);
  }
  for (const e of all) {
    const c = cs(e);
    if (!c.webkitLineClamp || c.webkitLineClamp === 'none' || /hidden|clip/.test(c.overflowY)) continue;
    const r = rect(e);
    if (!onScreen(r) || e.scrollHeight <= e.clientHeight + 2 || !seenEl(e)) continue;
    const bottom = r.bottom;
    if (textLines(e).some(({ q }) => q.top >= bottom - 2 && q.top < H)) report('clipline', e, `line-clamped to ${c.webkitLineClamp} lines but its box doesn't hide the rest (${e.scrollHeight}px of text in ${e.clientHeight}px)`, r);
  }

  const control = e => e.matches('a[href], button, [role=button], [role=link], [role=tab], [role=menuitem]');
  const realParent = e => { let n = up(e); while (n && n.nodeType === 1 && (cs(n).display === 'contents' || n.tagName === 'SLOT')) n = up(n); return n && n.nodeType === 1 ? n : null; };
  const members = new Map();
  for (const e of all) {
    if (!control(e) || e.parentElement?.closest('a[href], button, [role=button]') || !seenEl(e)) continue;
    const r = rect(e);
    if (r.height > 48 || r.width > 260 || label(e).length > 30 || /absolute|fixed/.test(cs(e).position) || inPopup(e) || e.closest('footer, [role=contentinfo]')) continue;
    for (let p = realParent(e), i = 0; p && i < 3; p = realParent(p), i++) { if (rect(p).height > 140) break; (members.get(p) || members.set(p, []).get(p)).push(e); }
  }
  const wrapped = new Set();
  for (const [p, items0] of members) {
    if (items0.length < 3 || !seenEl(p)) continue;
    const pr = rect(p), pc = cs(p);
    if (pr.width < 80) continue;
    if (items0.some(k => k.getClientRects().length > 1)) continue;
    const loose = (p.textContent || '').replace(/[\s·•|,–-]/g, '').length - items0.reduce((n, k) => n + (k.textContent || '').replace(/[\s·•|,–-]/g, '').length, 0);
    if (loose > 12) continue;
    const items = items0.map(k => ({ k, r: rect(k) }));
    const rows = [];
    for (const i of items.sort((a, b) => a.r.top - b.r.top)) { const row = rows.find(rw => Math.min(rw.bottom, i.r.bottom) - Math.max(rw.top, i.r.top) > Math.min(rw.bottom - rw.top, i.r.height) * .5); if (row) row.n++; else rows.push({ top: i.r.top, bottom: i.r.bottom, n: 1 }); }
    if (rows.length !== 2 && rows.length !== 3) continue;
    const sig = items0.map(label).sort().join('|');
    if (wrapped.has(sig)) continue;
    const content = pr.width - parseFloat(pc.paddingLeft) - parseFloat(pc.paddingRight);
    const need = items.reduce((s, i) => s + i.r.width + (parseFloat(cs(i.k).marginLeft) || 0) + (parseFloat(cs(i.k).marginRight) || 0), 0) + (parseFloat(pc.columnGap) || 0) * (items.length - 1);
    const most = Math.max(...rows.map(rw => rw.n)), least = Math.min(...rows.map(rw => rw.n));
    const fits = need <= content + 1 && most >= 2;
    if (fits || rows.length === 2 && most >= 3 && least === 1) { wrapped.add(sig); report('rowwrap', p, `${items.length} controls on ${rows.length} lines (${rows.map(rw => rw.n).join('+')})${fits ? `, they fit in ${Math.round(content)}px (need ${Math.round(need)}px)` : ''}`, pr); }
  }

  const barLike = e => { for (let n = e, i = 0; n && n.nodeType === 1 && i < 8; n = up(n), i++) if (n.matches('header, nav, [role=banner], [role=navigation], [role=toolbar], [role=menubar], [role=tablist], [id*="nav" i], [class*="toolbar" i], [class*="header" i], [class*="actions" i], [class*="action-bar" i], [class*="buttons" i]')) return true; return false; };
  const ink = e => { const lines = textLines(e, 20).map(l => l.q); for (const k of e.querySelectorAll('svg, img')) { if (k.parentElement?.closest('svg')) continue; const q = rect(k); if (q.width > 3 && q.height > 3) lines.push(q); }
    if (!lines.length) return null; const top = Math.min(...lines.map(q => q.top)), bottom = Math.max(...lines.map(q => q.bottom)); return { top, bottom, mid: (top + bottom) / 2 }; };
  const alignParents = new Set();
  for (const e of all) if ((control(e) || e.matches('svg, img')) && e.parentElement && !e.parentElement.closest('svg')) alignParents.add(e.parentElement);
  for (const p of alignParents) {
    if (!seenEl(p) || inPopup(p)) continue;
    const pr = rect(p);
    if (pr.height > 90 || pr.width < 40 || !barLike(p)) continue;
    const items = [...p.children].filter(k => seenEl(k) && !/absolute|fixed/.test(cs(k).position) && k.tagName !== 'svg' || k.tagName === 'svg' && seenEl(k)).map(k => ({ k, r: rect(k) }))
      .filter(i => i.r.height >= 8 && i.r.height <= 64 && i.r.width >= 8 && !(i.k.matches('svg, img') && (i.r.width > 40 || i.r.height > 40)) && (control(i.k) || i.k.matches('svg, img') || i.k.querySelector('a[href], button, [role=button], svg, img') || label(i.k).length <= 24 && label(i.k).length > 0));
    if (items.length < 2) continue;
    const sameRow = items.filter(i => items.some(o => o !== i && Math.min(o.r.bottom, i.r.bottom) - Math.max(o.r.top, i.r.top) > Math.min(o.r.height, i.r.height) * .5));
    if (sameRow.length < 2) continue;
    const heights = sameRow.map(i => i.r.height);
    const boxMid = i => i.r.top + i.r.height / 2;
    const middle = list => [...list].sort((a, b) => a - b)[list.length >> 1];
    const mids = sameRow.map(i => { const m = ink(i.k); return m ? m.mid : boxMid(i); });
    const med = middle(mids), boxMed = middle(sameRow.map(boxMid));
    const flagged = new Set();
    sameRow.forEach((i, n) => {
      const d = mids[n] - med;
      if (Math.abs(d) > 4 && Math.abs(boxMid(i) - boxMed) > 4 && Math.max(...heights) < 70) { flagged.add(i); report('rowalign', i.k, `${d > 0 ? 'sits' : 'rises'} ${Math.abs(Math.round(d))}px ${d > 0 ? 'below' : 'above'} the middle of its row in ${name(p)}`, i.r); }
    });
    const lastLines = sameRow.map(i => { const ls = textLines(i.k, 20); return ls.length ? { i, bottom: Math.max(...ls.map(l => l.q.bottom)), size: parseFloat(cs(ls[ls.length - 1].el).fontSize) } : null; }).filter(Boolean);
    if (lastLines.length >= 3) {
      const shared = lastLines.map(a => lastLines.filter(b => Math.abs(a.bottom - b.bottom) <= 2 && Math.abs(a.size - b.size) <= 2)).sort((a, b) => b.length - a.length)[0];
      if (shared.length >= 2 && shared.length >= lastLines.length * .6) {
        const base = middle(shared.map(a => a.bottom));
        for (const a of lastLines) { const d = a.bottom - base; if (!flagged.has(a.i) && Math.abs(d) > 4 && Math.abs(d) < 16 && Math.abs(a.size - shared[0].size) <= 2) report('rowalign', a.i.k, `text sits ${Math.abs(Math.round(d))}px ${d > 0 ? 'below' : 'above'} the line the rest of its row shares in ${name(p)}`, a.i.r); }
      }
    }
  }

  for (const a of all) {
    const ac = cs(a);
    if (!ringed(ac) || !seenEl(a) || inPopup(a)) continue;
    const ar = rect(a);
    if (ar.width < 24 || ar.height < 16 || ar.height > 120) continue;
    const clipsSelf = /hidden|clip/.test(ac.overflowX + ac.overflowY);
    if (!clipsSelf) for (const d of deep(a)) {
      const dc = cs(d);
      if (!painted(dc) || /absolute|fixed/.test(dc.position) || d.matches('svg *') || !seenEl(d) || inPopup(d)) continue;
      if (d.closest('svg')) continue;
      let clipped = false; for (let n = up(d); n && n !== a; n = up(n)) if (/hidden|clip/.test(cs(n).overflowX + cs(n).overflowY)) { clipped = true; break; }
      if (clipped) continue;
      const dr = rect(d), over = Math.max(ar.left - dr.left, dr.right - ar.right, ar.top - dr.top, dr.bottom - ar.bottom);
      if (over > 1) { report('spill', d, `painted box extends ${Math.round(over)}px past the ring of ${name(a)}`, dr); break; }
    }
    for (let p = up(a), i = 0; p && p.nodeType === 1 && i < 3; p = up(p), i++) {
      const pc = cs(p), pr = rect(p);
      if (pr.width > ar.width + 24 || pr.height > ar.height + 16) break;
      if (alphaOf(pc.backgroundColor) < .05 || pc.backgroundColor === ac.backgroundColor) continue;
      const out = Math.max(ar.left - pr.left, pr.right - ar.right, ar.top - pr.top, pr.bottom - ar.bottom);
      const radius = Math.max(parseFloat(pc.borderTopLeftRadius) || 0, parseFloat(ac.borderTopLeftRadius) || 0);
      if (out > 1 && out < 12 && radius < pr.height / 2 + 1) { report('spill', p, `${pc.backgroundColor} fill shows ${Math.round(out)}px outside the ring of ${name(a)}`, pr); break; }
    }
  }
  for (const p of all) {
    const pc = cs(p);
    if (!(parseFloat(pc.borderBottomWidth) >= 1 && pc.borderBottomStyle !== 'none' && alphaOf(pc.borderBottomColor) >= .08) || /hidden|clip/.test(pc.overflowY)) continue;
    const pr = rect(p);
    if (pr.width < 200 || pr.height < 20 || pr.height > 400 || !seenEl(p) || inPopup(p) || /fixed|sticky/.test(pc.position)) continue;
    const line = pr.bottom - parseFloat(pc.borderBottomWidth);
    for (const d of deep(p)) {
      if (d.closest('svg') && d.tagName !== 'svg' || !(control(d) || d.matches('svg, img') || painted(cs(d)))) continue;
      if ( /absolute|fixed/.test(cs(d).position) || inPopup(d)) continue;
      const dr = rect(d);
      if (dr.width < 6 || dr.height < 6 || !seenEl(d)) continue;
      let floated = false; for (let n = up(d); n && n !== p; n = up(n)) if (/absolute|fixed/.test(cs(n).position) || /hidden|clip/.test(cs(n).overflowY)) { floated = true; break; }
      if (floated) continue;
      if (dr.top < line - 1 && dr.bottom > line + 2) { report('spill', d, `crosses the bottom border of ${name(p)} by ${Math.round(dr.bottom - line)}px`, dr); break; }
      if (dr.top >= line + 1) { report('spill', d, `drawn ${Math.round(dr.top - line)}px below the bottom border of ${name(p)}, its parent`, dr); break; }
    }
  }

  const fields = all.filter(e => e.matches('input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=range]):not([type=color]):not([type=submit]):not([type=button]):not([type=image]):not([type=reset]):not([type=file]), textarea, [contenteditable=true], [role=textbox], [role=searchbox], input[role=combobox]'));
  const icons = all.filter(e => e.matches('svg, img, i, [class*="icon" i]') && !e.parentElement?.closest('svg'));
  for (const f of fields) {
    if (!seenEl(f)) continue;
    const fr = rect(f), fc = cs(f);
    if (fr.width < 40 || fr.height < 14 || fr.height > 120) continue;
    const left = fr.left + parseFloat(fc.borderLeftWidth) + parseFloat(fc.paddingLeft), right = fr.right - parseFloat(fc.borderRightWidth) - parseFloat(fc.paddingRight);
    const top = fr.top + parseFloat(fc.borderTopWidth) + parseFloat(fc.paddingTop), bottom = fr.bottom - parseFloat(fc.borderBottomWidth) - parseFloat(fc.paddingBottom);
    const text = f.value || f.placeholder || f.textContent || '';
    let textRight = right;
    if (f.tagName === 'INPUT' && text) { const pen = document.createElement('canvas').getContext('2d'); pen.font = `${fc.fontStyle} ${fc.fontWeight} ${fc.fontSize} ${fc.fontFamily}`; textRight = Math.min(right, left + pen.measureText(text).width); }
    for (const k of icons) {
      if (f.contains(k) || k.contains(f)) continue;
      const kr = rect(k);
      if (kr.width < 6 || kr.height < 6 || kr.width > 48 || kr.height > 48) continue;
      const ox = Math.min(kr.right, textRight) - Math.max(kr.left, left), oy = Math.min(kr.bottom, bottom) - Math.max(kr.top, top);
      if (ox <= 2 || oy <= 4 || !seenEl(k)) continue;
      const hit = document.elementsFromPoint(Math.max(kr.left, left) + ox / 2, Math.max(kr.top, top) + oy / 2);
      const iconIdx = hit.findIndex(h => h === k || k.contains(h) || h.contains?.(k) && h.matches('svg, i, [class*="icon" i]')), fieldIdx = hit.indexOf(f);
      if (fieldIdx >= 0 && iconIdx > fieldIdx && alphaOf(fc.backgroundColor) > .9) continue;
      report('iconovertext', k, `icon covers ${Math.round(ox)}x${Math.round(oy)}px of the ${text ? 'text' : 'text area'} of field "${label(f)}" ${name(f)}`, kr);
    }
  }

  for (const e of all) {
    const c = cs(e);
    if (!(alphaOf(c.backgroundColor) > .05 && c.backgroundColor !== cs(up(e) || document.documentElement).backgroundColor || ringed(c) || c.boxShadow !== 'none')) continue;
    const r = rect(e);
    if (/^(BODY|HTML)$/.test(e.tagName) || r.width < 150 || r.height < 80 || r.height > 700 || r.top < 0 || r.bottom > H || !seenEl(e) || inPopup(e) || /grid/.test(c.display)) continue;
    const bands = textLines(e, 300).map(l => [l.q.top, l.q.bottom]);
    for (const d of e.querySelectorAll('img, svg, video, canvas, iframe, input, textarea, button, select, hr, [role=img], [role=button]')) { if (d.matches('svg *')) continue; const q = rect(d); if (q.width > 2 && q.height > 2 && seenEl(d)) bands.push([q.top, q.bottom]); }
    for (const d of e.querySelectorAll('*')) { const dc = cs(d); if (d.matches('svg *')) continue; const pic = /url\(/.test(dc.backgroundImage); if (pic || painted(dc)) { const q = rect(d); if (q.width > 8 && q.height > 2 && (pic || q.height < Math.min(200, r.height * .6))) bands.push([q.top, q.bottom]); } }
    if (bands.length < 2) continue;
    bands.sort((a, b) => a[0] - b[0]);
    let reach = bands[0][1], worst = 0, at = 0;
    for (const [t, b] of bands.slice(1)) { if (t - reach > worst) { worst = t - reach; at = reach; } reach = Math.max(reach, b); }
    if (worst > 32) report('gap', e, `${Math.round(worst)}px empty band between its content at y=${Math.round(at)}`, { left: r.left, top: at, width: r.width, height: worst });
  }
  return found;
}

function net19Rhythm() {
  const W = innerWidth, H = innerHeight;
  const found = { patch: [], tight: [], loose: [] };
  const up = e => e.parentElement || (e.parentNode && e.parentNode.host) || null;
  const name = e => (e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '')).slice(0, 60);
  const label = e => (e.getAttribute?.('aria-label') || e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 30);
  const box = r => ({ x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) });
  const seen = new Set();
  const report = (k, e, detail, r) => { const key = k + name(e); if (seen.has(key) || found[k].length >= 30) return; seen.add(key); found[k].push({ what: `${name(e)} "${label(e)}"`, detail, ...box(r) }); };
  const all = [];
  const collect = root => { for (const e of root.querySelectorAll('*')) { all.push(e); if (e.shadowRoot) collect(e.shadowRoot); } };
  collect(document);
  const styleOf = new Map(), rectOf = new Map();
  const cs = e => styleOf.get(e) || styleOf.set(e, getComputedStyle(e)).get(e);
  const rect = e => rectOf.get(e) || rectOf.set(e, e.getBoundingClientRect()).get(e);
  const visible = (e, anywhere) => { const r = rect(e); if (r.width < 2 || r.height < 2 || (!anywhere && (r.bottom < 0 || r.top > H || r.right < 0 || r.left > W))) return false;
    for (let n = e; n && n.nodeType === 1; n = up(n)) { const c = cs(n); if (c.display === 'none' || c.visibility === 'hidden' || +c.opacity < .05) return false; } return true; };
  const rgb = t => { const m = String(t).match(/[\d.]+/g); return m ? m.map(Number) : null; };
  const lightness = ([r, g, b]) => { const f = v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; const y = .2126 * f(r) + .7152 * f(g) + .0722 * f(b); return y > .008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y; };
  const neutral = ([r, g, b]) => Math.max(r, g, b) - Math.min(r, g, b) < 28;
  const fillOf = c => { const bg = rgb(c.backgroundColor); if (bg && (bg[3] ?? 1) > .5) return bg; const g = c.backgroundImage.match(/rgba?\([^)]*\)/g); if (g) for (const stop of g) { const v = rgb(stop); if (v && (v[3] ?? 1) > .5) return v; } return null; };
  const behind = e => { for (let n = up(e); n && n.nodeType === 1; n = up(n)) { const f = fillOf(cs(n)); if (f && !/url\(/.test(cs(n).backgroundImage)) return f; } return rgb(getComputedStyle(document.body).backgroundColor) || [255, 255, 255]; };
  const pictured = e => { for (let n = e; n && n.nodeType === 1; n = up(n)) { if (/url\(/.test(cs(n).backgroundImage) || n.matches('video, canvas, picture, [role=img], [class*="player" i], [class*="thumbnail" i], [class*="media" i]')) return true; } return false; };
  for (const e of all) {
    const c = cs(e), own = fillOf(c);
    if (!own || !neutral(own) || e.matches('img, svg, svg *, video, canvas, iframe, input[type=range]')) continue;
    const r = rect(e);
    if (r.width > 500 || r.height > 120 || !visible(e) || pictured(e)) continue;
    const under = behind(e);
    if (!neutral(under)) continue;
    const d = Math.abs(lightness(own) - lightness(under));
    if (d > 45) report('patch', e, `neutral ${lightness(own) < lightness(under) ? 'dark' : 'light'} patch (L ${Math.round(lightness(own))}) on L ${Math.round(lightness(under))}`, r);
  }
  const groups = new Map();
  for (const e of all) {
    const p = up(e);
    if (!p || !visible(e, true)) continue;
    const r = rect(e);
    if (r.height < 30 || r.height > 900 || r.width < 200) continue;
    const key = (p.tagName || '') + (p.getRootNode() === document ? '' : '#shadow');
    const sig = e.tagName + '|' + (typeof e.className === 'string' ? e.className.split(/\s+/).filter(x => !/\d/.test(x)).sort().join('.') : '');
    let m = groups.get(key); if (!m) groups.set(key, m = new Map());
    (m.get(sig) || m.set(sig, []).get(sig)).push(e);
  }
  const content = e => { let top = Infinity, bottom = -Infinity;
    const t = document.createTreeWalker(e.shadowRoot || e, NodeFilter.SHOW_TEXT);
    for (let n = t.nextNode(), i = 0; n && i < 400; n = t.nextNode(), i++) { if (!n.nodeValue.trim() || !n.parentElement || !visible(n.parentElement, true)) continue; const range = document.createRange(); range.selectNodeContents(n); for (const q of range.getClientRects()) if (q.height > 2) { top = Math.min(top, q.top); bottom = Math.max(bottom, q.bottom); } }
    for (const k of (e.shadowRoot || e).querySelectorAll('img, svg, video, button, input, textarea')) { if (k.matches('svg *')) continue; const q = rect(k); if (q.width > 4 && q.height > 4 && visible(k, true)) { top = Math.min(top, q.top); bottom = Math.max(bottom, q.bottom); } }
    return top < bottom ? { top, bottom } : null; };
  for (const m of groups.values()) for (const list of m.values()) {
    if (list.length < 3) continue;
    const pads = list.slice(0, 12).map(e => { const r = rect(e), k = content(e); return k && { e, r, above: k.top - r.top, below: r.bottom - k.bottom }; }).filter(Boolean);
    if (pads.length < 3) continue;
    const tight = pads.filter(p => p.above >= 12 && p.below <= 3);
    if (tight.length >= Math.ceil(pads.length / 2)) report('tight', tight[0].e, `repeated items keep ${Math.round(tight[0].above)}px above their content but ${Math.round(tight[0].below)}px below`, tight[0].r);
  }
  const srOnly = e => { for (let n = e, i = 0; n && n.nodeType === 1 && i < 4; n = up(n), i++) { const c = cs(n), q = rect(n); if ((c.clip && c.clip !== 'auto') || /inset\(50%|circle\(0/.test(c.clipPath) || (q.width <= 2 || q.height <= 2) && c.overflow !== 'visible') return true; } return false; };
  const sigOf = e => e.tagName + '|' + (typeof e.className === 'string' ? e.className.split(/\s+/).filter(x => !/\d/.test(x)).sort().join('.') : '');
  const blockOf = el => { for (let n = el; n && n.nodeType === 1; n = up(n)) if (!/^inline/.test(cs(n).display) && cs(n).display !== 'contents') return n; return el; };
  const prose = b => b.matches('p, li, blockquote, pre, dd') || b.tagName === 'DIV' && [...b.childNodes].some(n => n.nodeType === 3 && n.nodeValue.trim().length > 40);
  const lineHeight = el => { const c = cs(el), v = parseFloat(c.lineHeight); return v > 0 ? v : parseFloat(c.fontSize) * 1.2; };
  const shownRect = e => { const q = rect(e); let { top, bottom, left, right } = q;
    for (let n = up(e), i = 0; n && n.nodeType === 1 && i < 12; n = up(n), i++) { const c = cs(n); if (c.position === 'fixed') break; if (/hidden|clip|auto|scroll/.test(c.overflowX + c.overflowY)) { const b = rect(n); top = Math.max(top, b.top); bottom = Math.min(bottom, b.bottom); left = Math.max(left, b.left); right = Math.min(right, b.right); } }
    return { top, bottom, left, right, width: right - left, height: bottom - top }; };
  const rowsOf = item => { const lines = [], solid = [];
    const own = n => { for (let k = n; k && k !== item; k = k.assignedSlot || up(k)) if (sigOf(k) === sigOf(item) || k.tagName === item.tagName && k.tagName.includes('-')) return false; return true; };
    const walk = root => { const t = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
      for (let n = t.nextNode(), i = 0; n && i < 600; n = t.nextNode(), i++) {
        if (n.nodeType === 1) { if (n.shadowRoot) walk(n.shadowRoot); if (n.tagName === 'SLOT') for (const k of n.assignedElements()) walk(k); if (n.matches('img, svg, video, canvas, iframe, input, textarea, select, hr, [role=img]') && !n.matches('svg *') && own(n) && visible(n, true)) { const q = shownRect(n); if (q.width > 4 && q.height > 4) solid.push(q); } continue; }
        const el = n.parentElement || n.parentNode?.host;
        if (!n.nodeValue.trim() || !el || !visible(el, true) || srOnly(el) || !own(el) || el.closest('button, [role=button], [role=toolbar], select, .btn, a[class*="btn" i], a[class*="button" i]')) continue;
        const range = document.createRange(); range.selectNodeContents(n);
        for (const q of range.getClientRects()) if (q.height > 4 && q.width > 1) lines.push({ top: q.top, bottom: q.bottom, left: q.left, right: q.right, el, block: blockOf(el) });
      } };
    walk(item); if (item.shadowRoot) walk(item.shadowRoot);
    for (const k of item.querySelectorAll('button, [role=button]')) { const q = shownRect(k); if (q.width > 4 && q.height > 4 && own(k) && visible(k, true)) solid.push(q); }
    lines.sort((a, b) => a.top - b.top);
    return { lines, solid }; };
  const filled = [];
  const gather = root => { const t = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    for (let n = t.nextNode(); n && filled.length < 4000; n = t.nextNode()) {
      if (n.nodeType === 1) { if (n.shadowRoot) gather(n.shadowRoot); if (n.matches('img, svg, video, canvas, iframe, input, textarea, select, button, [role=button], [role=img]') && !n.matches('svg *')) { const q = shownRect(n); if (q.width > 4 && q.height > 4 && q.bottom > 0 && q.top < H && visible(n)) filled.push(q); } continue; }
      const el = n.parentElement || n.parentNode?.host;
      if (!n.nodeValue.trim() || !el || !visible(el, true) || srOnly(el)) continue;
      const range = document.createRange(); range.selectNodeContents(n);
      for (const q of range.getClientRects()) if (q.height > 4 && q.width > 1 && q.bottom > 0 && q.top < H) filled.push(q);
    } };
  gather(document);
  const loose = new Map();
  const emptyBand = (r, top, bottom) => !filled.some(q => q.left < r.right && q.right > r.left && q.top < bottom - 1 && q.bottom > top + 1 && !(q.top < top - 4 && q.bottom > bottom + 4));
  for (const m of groups.values()) for (const list of m.values()) {
    if (list.length < 3) continue;
    for (const item of list.slice(0, 8)) {
      const r = rect(item); if (r.height > 900 || r.bottom < 0 || r.top > H || !visible(item)) continue;
      const { lines, solid } = rowsOf(item);
      let worst = null;
      const segs = new Set();
      for (const la of lines) {
        const seg = [la]; let top = la.top, bottom = la.bottom, left = la.left, right = la.right;
        for (let grew = true; grew;) { grew = false;
          for (const q of [...lines, ...solid.filter(q => q.height <= 40)]) {
            if (seg.includes(q) || Math.min(q.bottom, bottom) - Math.max(q.top, top) < Math.min(q.bottom - q.top, bottom - top) * .5 || q.left > right + 12 || q.right < left - 12) continue;
            seg.push(q); top = Math.min(top, q.top); bottom = Math.max(bottom, q.bottom); left = Math.min(left, q.left); right = Math.max(right, q.right); grew = true;
          } }
        const sig = [top, bottom, left, right].map(Math.round).join(',');
        if (segs.has(sig)) continue;
        segs.add(sig);
        const below = lines.filter(l => !seg.includes(l) && l.top >= bottom - 2 && Math.min(l.right, right) - Math.max(l.left, left) > 0);
        if (!below.length) continue;
        const lb = below.filter(l => l.top < below[0].top + 6).sort((x, y) => parseFloat(cs(y.el).fontSize) - parseFloat(cs(x.el).fontSize))[0], nextTop = below[0].top;
        const up2 = seg.filter(l => l.el).sort((x, y) => y.bottom - x.bottom)[0];
        const gap = nextTop - bottom, x0 = Math.max(left, lb.left), x1 = Math.min(right, lb.right);
        if (gap <= 0 || solid.some(q => q.top < nextTop - 1 && q.bottom > bottom + 1 && q.left < x1 && q.right > x0 && !(q.top < bottom - 4 && q.bottom > nextTop + 4)) || !emptyBand({ left: x0, right: x1 }, bottom, nextTop)) continue;
        if (up2.block !== lb.block && prose(up2.block) && prose(lb.block) && Math.abs(parseFloat(cs(up2.el).fontSize) - parseFloat(cs(lb.el).fontSize)) < 1) continue;
        const size = l => parseFloat(cs(l.el).fontSize), rowSize = Math.max(...seg.filter(l => l.el).map(size));
        const byline = seg.some(l => l.el && Math.abs(l.top - lines[0].top) < 3) && rowSize < size(lb) - .5;
        const limit = byline ? Math.max(8, .4 * lineHeight(lb.el)) : Math.max(24, 1.5 * Math.max(lineHeight(up2.el), lineHeight(lb.el)));
        if (gap > limit && gap < 120 && (!worst || gap - limit > worst.gap - worst.limit)) worst = { gap, limit, byline, a: { ...up2, bottom }, b: lb };
      }
      if (!worst) continue;
      const key = [worst.a.left, worst.a.bottom, worst.b.left, worst.b.top].map(Math.round).join(',');
      const was = loose.get(key);
      if (!was || r.width * r.height > was.area) loose.set(key, { area: r.width * r.height, what: `${name(item)} "${label(item)}"`, detail: `${Math.round(worst.gap)}px between ${worst.byline ? 'its byline ' : ''}"${(worst.a.el.textContent || '').trim().slice(0, 20)}" and "${(worst.b.el.textContent || '').trim().slice(0, 20)}" (limit ${Math.round(worst.limit)}px)`, ...box({ left: r.left, top: worst.a.bottom, width: r.width, height: worst.gap }) });
    }
  }
  found.loose = [...loose.values()].slice(0, 30).map(({ area, ...rest }) => rest);
  return found;
}

function net19Badges() {
  const W = innerWidth, H = innerHeight;
  const found = { badgealign: [] };
  const up = e => e.assignedSlot || e.parentElement || (e.parentNode && e.parentNode.host) || null;
  const name = e => (e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '')).slice(0, 60);
  const text = e => (e.textContent || '').replace(/\s+/g, ' ').trim();
  const box = r => ({ x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) });
  const styleOf = new Map(), rectOf = new Map();
  const cs = e => styleOf.get(e) || styleOf.set(e, getComputedStyle(e)).get(e);
  const rect = e => rectOf.get(e) || rectOf.set(e, e.getBoundingClientRect()).get(e);
  const seenEl = e => { const r = rect(e); if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > H || r.right < 0 || r.left > W) return false; for (let n = e; n && n.nodeType === 1; n = up(n)) { const c = cs(n); if (c.display === 'none' || c.visibility !== 'visible' || +c.opacity < .05) return false; } return true; };
  const alphaOf = c => { const m = String(c).match(/[\d.]+/g); return !m ? 0 : m.length > 3 ? +m[3] : 1; };
  const painted = c => alphaOf(c.backgroundColor) > .05 || /gradient/.test(c.backgroundImage) || ['Top', 'Right', 'Bottom', 'Left'].every(s => parseFloat(c[`border${s}Width`]) >= 1 && c[`border${s}Style`] !== 'none' && alphaOf(c[`border${s}Color`]) > .1);
  const inside = (el, outer) => { for (let n = el; n; n = up(n)) if (n === outer) return true; return false; };
  const lines = [], badges = [];
  const walk = root => { const t = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    for (let n = t.nextNode(); n && lines.length < 3000; n = t.nextNode()) {
      if (n.nodeType === 1) {
        if (n.shadowRoot) walk(n.shadowRoot);
        if (n.matches('button, [role=button], input, select, textarea, svg, svg *, img, video, canvas')) continue;
        const c = cs(n);
        if (!painted(c) || /absolute|fixed/.test(c.position) || /super|sub/.test(c.verticalAlign)) continue;
        const r = rect(n), t2 = text(n);
        if (r.height < 10 || r.height > 26 || r.width < 10 || r.width > 220 || !t2 || t2.length > 24 || r.bottom < 0 || r.top > H) continue;
        badges.push(n);
        continue;
      }
      const el = n.parentElement || n.parentNode?.host;
      if (!n.nodeValue.trim() || !el || el.closest('script, style, noscript')) continue;
      const range = document.createRange(); range.selectNodeContents(n);
      for (const q of range.getClientRects()) if (q.width > 2 && q.height > 6 && q.bottom > 0 && q.top < H) lines.push({ q, el });
    } };
  walk(document);
  const seen = new Set();
  for (const b of badges) {
    if (badges.some(o => o !== b && inside(o, b) && text(o) === text(b)) || !seenEl(b)) continue;
    const r = rect(b), mid = r.top + r.height / 2;
    const near = lines.filter(({ q, el }) => {
      if (inside(el, b) || badges.some(o => o !== b && inside(el, o) && !inside(b, o)) || !seenEl(el)) return false;
      const oy = Math.min(q.bottom, r.bottom) - Math.max(q.top, r.top), gx = Math.max(q.left - r.right, r.left - q.right);
      return oy > Math.min(q.height, r.height) * .5 && gx >= -1 && gx <= 16 && q.height >= r.height * .5;
    }).sort((a, b2) => parseFloat(cs(b2.el).fontSize) - parseFloat(cs(a.el).fontSize) || Math.abs(a.q.top + a.q.height / 2 - mid) - Math.abs(b2.q.top + b2.q.height / 2 - mid));
    if (!near.length) continue;
    const line = near[0], d = mid - (line.q.top + line.q.height / 2);
    const key = text(b) + '|' + Math.round(r.top) + '|' + Math.round(r.left);
    if (Math.abs(d) <= 2 || seen.has(key) || found.badgealign.length >= 30) continue;
    seen.add(key);
    found.badgealign.push({ what: `${name(b)} "${text(b)}"`, detail: `badge middle ${Math.abs(Math.round(d))}px ${d < 0 ? 'above' : 'below'} the middle of the text beside it ("${text(line.el).slice(0, 24)}" ${name(line.el)})`, ...box(r) });
  }
  return found;
}

function net19Content() {
  const shown = e => e.checkVisibility ? e.checkVisibility({ visibilityProperty: true, opacityProperty: true }) : e.getClientRects().length > 0;
  const items = new Set();
  for (const e of document.querySelectorAll('a[href] :is(h1, h2, h3, h4, [role=heading]), :is(h1, h2, h3, h4, [role=heading]) a[href], a#video-title, a[href][id*="title" i], [data-testid*="title" i] a[href]')) if (shown(e)) items.add(e.closest('a[href]') || e);
  return { items: items.size, text: (document.body?.innerText || '').replace(/\s+/g, ' ').length };
}

function net19Layout() {
  const W = innerWidth, H = innerHeight;
  const collide = [], effects = [];
  const visible = e => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e);
    return r.width > 4 && r.height > 4 && r.bottom > 0 && r.right > 0 && r.top < H && r.left < W && c.visibility === 'visible' && +c.opacity > .05; };
  const name = e => (e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '')).slice(0, 70);
  const box = r => ({ x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) });
  const blocks = [...document.querySelectorAll('article, section, aside, nav, header, main, [role=article], [role=complementary], [role=navigation], [role=main], [data-testid*="post" i], shreddit-post, [class*="card" i]')].filter(e => {
    if (!visible(e)) return false;
    const r = e.getBoundingClientRect(); const c = getComputedStyle(e);
    return r.width >= 120 && r.height >= 40 && !/fixed|sticky|absolute/.test(c.position) && !e.closest('[role=dialog], [role=menu], [role=listbox], dialog');
  });
  const seen = new Set();
  for (let i = 0; i < blocks.length && i < 400; i++) for (let j = i + 1; j < blocks.length && j < 400; j++) {
    const a = blocks[i], b = blocks[j];
    if (a.contains(b) || b.contains(a)) continue;
    const p = a.getBoundingClientRect(), q = b.getBoundingClientRect();
    const ox = Math.min(p.right, q.right) - Math.max(p.left, q.left), oy = Math.min(p.bottom, q.bottom) - Math.max(p.top, q.top);
    if (ox < 12 || oy < 12) continue;
    const key = name(a) + '|' + name(b);
    if (seen.has(key)) continue;
    seen.add(key);
    collide.push({ what: `${name(a)} × ${name(b)}`, detail: `blocks overlap ${Math.round(ox)}×${Math.round(oy)}px`, ...box({ left: Math.max(p.left, q.left), top: Math.max(p.top, q.top), width: ox, height: oy }) });
  }
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const styled = new Set();
  for (let n = walker.nextNode(), k = 0; n && k < 3000; n = walker.nextNode(), k++) {
    const el = n.parentElement;
    if (!el || styled.has(el) || !n.nodeValue.trim()) continue;
    styled.add(el);
    const c = getComputedStyle(el);
    const stroke = parseFloat(c.webkitTextStrokeWidth) > 0;
    if ((c.textShadow && c.textShadow !== 'none') || stroke) {
      if (!visible(el)) continue;
      effects.push({ what: name(el), detail: stroke ? 'text stroke' : `text shadow ${c.textShadow.slice(0, 50)}`, ...box(el.getBoundingClientRect()) });
    }
  }
  return { collide: collide.slice(0, 40), effects: effects.slice(0, 40) };
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
