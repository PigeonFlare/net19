import { rgba } from './color.js';
(() => {
  const theme = globalThis.net19Theme;
  if (!theme || globalThis.net19GuardStarted) return;
  globalThis.net19GuardStarted = true;
  const root = document.documentElement;

  const LATER = /^(?:ask (?:ai|anything|youtube|meta ai|gemini|copilot|rufus|target|about (?:files|this (?:page|video|result))|the chatbot)|ai mode|ai overviews?|try ai mode|ai search|search with ai|ai assist(?:ant)?|ai generator|ai image generator|create images?|create an image|generate(?: an)? images?|imagine with ai|brainstorm|help me write|write with ai|summari[sz]e(?: with ai)?|explain with ai|gemini|google gemini|copilot|microsoft copilot|grok|meta ai|chatgpt|rufus|magic apron|mylow|arti)$/i;
  const extra = theme.later instanceof RegExp ? theme.later : null;
  const keep = theme.keepLabels instanceof RegExp ? theme.keepLabels : null;
  const label = text => String(text || '').replace(/\s+/g, ' ').replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N})]+$/gu, '').trim();
  const later = text => { const t = label(globalThis.net19English(label(text))); return t.length > 1 && t.length < 40 && !keep?.test(t) && (LATER.test(t) || !!extra?.test(t)); };
  const CONTROL = 'button, a, [role="button"], [role="tab"], [role="menuitem"], [role="link"], [role="option"], [class*="chip" i]';
  const ASKING = /^ask (?:gmail|google|photos|drive|maps|youtube|docs)\b|\b(?:or ask\b|ask anything|ask (?:a|any|your) question|ask (?:ai|me|gemini|copilot|rufus)|chat with)/i;
  const hideLater = scope => {
    for (const el of [...(scope.matches?.(CONTROL) ? [scope] : []), ...scope.querySelectorAll?.(CONTROL) || []]) {
      if (el.hasAttribute('data-net19-hidden')) continue;
      const words = el.textContent;
      if (words.length > 200 && !el.hasAttribute('aria-label') && !el.hasAttribute('title')) continue;
      if (later(words) || later(el.getAttribute('aria-label')) || later(el.getAttribute('title'))) {
        el.setAttribute('data-net19-hidden', '');
        const item = el.parentElement;
        if (item && /^(LI|YT-CHIP-CLOUD-CHIP-RENDERER)$/.test(item.tagName) && item.children.length === 1) item.setAttribute('data-net19-hidden', '');
      }
    }
    for (const field of [...(scope.matches?.('input[placeholder], textarea[placeholder]') ? [scope] : []), ...scope.querySelectorAll?.('input[placeholder], textarea[placeholder]') || []]) {
      const text = field.getAttribute('placeholder');
      if (!ASKING.test(text)) continue;
      const plain = text.replace(/\s*(?:,|\bor\b)?\s*(?:ask|chat)\b.*$/i, '').trim();
      field.setAttribute('placeholder', plain && plain !== text ? plain : theme.searchLabel || 'Search');
    }
  };

  const channel = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; };
  const lum = c => .2126 * channel(c[0]) + .7152 * channel(c[1]) + .0722 * channel(c[2]);
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const over = (top, under) => { const a = top[3]; return [0, 1, 2].map(i => top[i] * a + under[i] * (1 - a)).concat(1); };
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
  const shownAs = (c, p) => (p ? flip(c) : c);
  let flips = new Map();
  const parity = el => {
    if (!el || el.nodeType !== 1) return 0;
    if (flips.has(el)) return flips.get(el);
    let p = parity(el.parentElement);
    const f = getComputedStyle(el).filter;
    const m = f && f !== 'none' && f.match(/invert\(([\d.]+)\)/);
    if (m && +m[1] > .5) p ^= 1;
    flips.set(el, p);
    return p;
  };
  const gradient = image => {
    if (/url\(/.test(image) || !/gradient\(/.test(image)) return null;
    const stops = (image.match(/rgba?\([^)]*\)/g) || []).map(rgba).filter(Boolean);
    if (!stops.length) return null;
    return [0, 1, 2, 3].map(i => stops.reduce((sum, c) => sum + c[i], 0) / stops.length);
  };
  const MEDIA = 'img, picture, video, canvas, svg image, iframe';
  let layerOf = new Map(), mediaOf = new Map();
  const tiles = new Map();
  const texture = image => {
    const url = /^url\("?([^")]+)"?\)$/.exec(image.trim())?.[1];
    if (!url || /^data:image\/svg/.test(url)) return null;
    if (tiles.has(url)) return tiles.get(url) || null;
    let same = false;
    try { same = /^data:/.test(url) || new URL(url, location.href).origin === location.origin; } catch {}
    if (!same) { tiles.set(url, null); return null; }
    tiles.set(url, null);
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = new OffscreenCanvas(8, 8), ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, 8, 8);
        const d = ctx.getImageData(0, 0, 8, 8).data, sum = [0, 0, 0, 0];
        for (let i = 0; i < d.length; i += 4) { sum[0] += d[i] * d[i + 3]; sum[1] += d[i + 1] * d[i + 3]; sum[2] += d[i + 2] * d[i + 3]; sum[3] += d[i + 3]; }
        if (sum[3] / 64 < 200) return;
        const mean = [sum[0] / sum[3], sum[1] / sum[3], sum[2] / sum[3], 1], m = lum(mean);
        let spread = 0;
        for (let i = 0; i < d.length; i += 4) spread = Math.max(spread, Math.abs(lum([d[i], d[i + 1], d[i + 2]]) - m));
        if (spread > .12) return;
        tiles.set(url, mean);
        dirty = true; soon(50);
      } catch {}
    };
    img.src = url;
    return null;
  };
  const layer = e => {
    let info = layerOf.get(e);
    if (!info) {
      const style = getComputedStyle(e);
      const masked = (style.maskImage && style.maskImage !== 'none') || (style.webkitMaskImage && style.webkitMaskImage !== 'none') || /text|padding|content/.test(style.backgroundClip);
      const shade = style.backgroundImage !== 'none' && !masked ? gradient(style.backgroundImage) : null;
      const tile = style.backgroundImage !== 'none' && !shade ? texture(style.backgroundImage) : null;
      info = { blocked: style.backgroundImage !== 'none' && !masked && !shade && !tile, shade: shade || tile, color: rgba(style.backgroundColor), blend: style.mixBlendMode };
      layerOf.set(e, info);
    }
    return info;
  };
  const mediaBoxes = e => {
    let boxes = mediaOf.get(e);
    if (!boxes) {
      boxes = [];
      for (const child of e.children) if (child.matches(MEDIA) || child.querySelector?.(':scope > img, :scope > video, :scope > picture')) boxes.push(child.getBoundingClientRect());
      mediaOf.set(e, boxes);
    }
    return boxes;
  };
  const backdrop = el => {
    const layers = [];
    let b = null;
    for (let e = el; e; e = e.parentElement) {
      const { blocked, shade, color } = layer(e);
      if (blocked) return null;
      if (e !== el) {
        const boxes = mediaBoxes(e);
        if (boxes.length) {
          b ??= el.getBoundingClientRect();
          for (const a of boxes) if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) return null;
        }
      }
      if (shade && shade[3] > 0) layers.push({ color: shade, el: e });
      if (shade && shade[3] >= .95) break;
      if (color && color[3] > 0) {
        layers.push({ color, el: e });
        if (color[3] >= .95) break;
      }
      if (e === root) break;
    }
    let base = shownAs([255, 255, 255, 1], parity(root));
    const last = layers[layers.length - 1];
    if (last && last.color[3] >= .95) { base = shownAs(last.color, parity(last.el)); layers.pop(); }
    for (let i = layers.length - 1; i >= 0; i--) base = over(shownAs(layers[i].color, parity(layers[i].el)), base);
    return { color: base };
  };
  const painted = e => { const st = getComputedStyle(e); return (/url\(/.test(st.backgroundImage) && !texture(st.backgroundImage)) || ['::before', '::after'].some(p => /url\(/.test(getComputedStyle(e, p).backgroundImage)); };
  const overPicture = (el, box) => {
    const x = Math.min(innerWidth - 1, Math.max(0, box.left + Math.min(box.width, 60) / 2)), y = Math.min(innerHeight - 1, Math.max(0, box.top + box.height / 2));
    for (const hit of document.elementsFromPoint(x, y)) {
      if (hit === el || el.contains(hit)) continue;
      if (hit.matches(MEDIA) || painted(hit)) return true;
      if (texture(getComputedStyle(hit).backgroundImage)) return false;
      const color = rgba(getComputedStyle(hit).backgroundColor);
      if (color && color[3] >= .95) return false;
    }
    return false;
  };
  const inkSheet = document.createElement('style');
  inkSheet.textContent = '[data-net19-hidden]{display:none!important}' +
    '[data-net19-ink="dark"],[data-net19-ink="dark"] *{color:#1d1d1f!important;-webkit-text-fill-color:#1d1d1f!important}' +
    '[data-net19-ink="light"],[data-net19-ink="light"] *{color:#f5f5f7!important;-webkit-text-fill-color:#f5f5f7!important}' +
    '[data-net19-blend]{mix-blend-mode:normal!important}' +
    'svg[data-net19-icon="light"]{filter:brightness(0) invert(.92)!important}svg[data-net19-icon="dark"]{filter:brightness(0) invert(.12)!important}' +
    ':is(input,textarea)[data-net19-ink="dark"]{caret-color:#1d1d1f!important}:is(input,textarea)[data-net19-ink="dark"]::placeholder{color:#5f6368!important;-webkit-text-fill-color:#5f6368!important;opacity:1!important}' +
    ':is(input,textarea)[data-net19-ink="light"]{caret-color:#f5f5f7!important}:is(input,textarea)[data-net19-ink="light"]::placeholder{color:#bdc1c6!important;-webkit-text-fill-color:#bdc1c6!important;opacity:1!important}';
  const original = new WeakMap(), inline = new WeakMap();
  let blendDark = null, fades = new Map();
  const fadeOf = e => { if (!e || e === root || e.nodeType !== 1) return 1; let f = fades.get(e); if (f === undefined) { f = +getComputedStyle(e).opacity * fadeOf(e.parentElement); fades.set(e, f); } return f; };
  let textCache = null;
  const textElements = () => {
    if (textCache) return textCache;
    const found = textCache = new Set();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: n => n.nodeValue.trim().length > 1 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP,
    });
    for (let n = walker.nextNode(); n && found.size < 3000; n = walker.nextNode()) if (n.parentElement) found.add(n.parentElement);
    return found;
  };
  const lift = (text, pt, under, goal, alpha = 1) => {
    const drawn = c => over(shownAs([...c.slice(0, 3), alpha], pt), under);
    const tryWith = end => {
      let lo = 0, hi = 1, best = null;
      for (let i = 0; i < 12; i++) {
        const t = (lo + hi) / 2, c = [0, 1, 2].map(k => Math.round(text[k] + (end[k] - text[k]) * t)).concat(1);
        if (ratio(drawn(c), under) >= goal) { best = c; hi = t; } else lo = t;
      }
      return best;
    };
    const toDark = tryWith([0, 0, 0]), toLight = tryWith([255, 255, 255]);
    const pick = toDark && toLight ? (ratio(drawn(toDark), under) <= ratio(drawn(toLight), under) ? toDark : toLight) : toDark || toLight;
    if (!pick) return ratio(shownAs([29, 29, 31, 1], pt), under) >= ratio(shownAs([245, 245, 247, 1], pt), under) ? 'dark' : 'light';
    return `rgb(${pick[0]}, ${pick[1]}, ${pick[2]})`;
  };
  const SHAPES = 'path, circle, rect, polygon, polyline, ellipse, line, use';
  const iconColor = svg => {
    const colors = new Set();
    let first = null;
    for (const shape of [...svg.querySelectorAll(SHAPES)].slice(0, 12)) {
      const st = getComputedStyle(shape);
      for (const value of [st.fill, st.stroke]) {
        if (!value || value === 'none' || /url\(/.test(value)) continue;
        const c = rgba(value);
        if (!c || c[3] < .3) continue;
        colors.add(c.slice(0, 3).join());
        first ||= c;
      }
    }
    return colors.size === 1 ? first : null;
  };
  const check = () => {
    if (!document.body) return;
    flips = new Map(); layerOf = new Map(); mediaOf = new Map(); fades = new Map();
    const view = { w: innerWidth, h: innerHeight };
    const changes = [];
    const dark = root.getAttribute('data-net19-mode') === 'dark';
    if (dark !== blendDark) { blendDark = dark; for (const e of document.querySelectorAll('[data-net19-blend]')) e.removeAttribute('data-net19-blend'); }
    for (const el of textElements()) {
      if (el.closest('script, style, noscript, [data-net19-hidden]')) continue;
      for (let e = el, i = 0; e && e !== root && i < 12; e = e.parentElement, i++) {
        const { blend } = layer(e);
        if ((dark && blend === 'multiply') || (!dark && blend === 'screen')) { if (!e.hasAttribute('data-net19-blend')) e.setAttribute('data-net19-blend', ''); }
      }
      const box = el.getBoundingClientRect();
      if (box.width < 2 || box.height < 2 || box.bottom < 0 || box.top > view.h || box.right < 0 || box.left > view.w) continue;
      const style = getComputedStyle(el);
      if (style.visibility !== 'visible' || +style.opacity < .1 || parseFloat(style.fontSize) < 8) continue;
      let text = original.get(el);
      if (!text) { text = rgba(style.webkitTextFillColor && style.webkitTextFillColor !== style.color ? style.webkitTextFillColor : style.color); if (!text) continue; }
      if (text[3] < .2) continue;
      const bg = backdrop(el);
      if (!bg) { if (el.hasAttribute('data-net19-ink')) changes.push([el, null]); continue; }
      const pt = parity(el), inText = bg.color;
      const fade = fadeOf(el);
      if (fade < .15) continue;
      const seen = [...text.slice(0, 3), text[3] * fade];
      const shown = over(shownAs(seen, pt), inText);
      const current = el.getAttribute('data-net19-ink');
      const size = parseFloat(style.fontSize), large = size >= 24 || (size >= 18.6 && +style.fontWeight >= 600);
      const chroma = c => Math.max(...c.slice(0, 3)) - Math.min(...c.slice(0, 3));
      const floor = large ? 3 : chroma(inText) > 90 || chroma(shown) > 90 ? 3.2 : 4;
      if (ratio(shown, inText) >= floor) { if (current) changes.push([el, null]); continue; }
      if (!current && overPicture(el, box)) continue;
      if (!original.has(el)) original.set(el, text);
      const lifted = lift(text, pt, inText, floor + .3, text[3] * fade);
      if (current !== lifted) changes.push([el, lifted]);
    }
    for (const f of document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=range]):not([type=color]):not([type=submit]):not([type=button]):not([type=image]):not([type=reset]), textarea')) {
      const box = f.getBoundingClientRect();
      if (box.width < 20 || box.height < 10 || box.bottom < 0 || box.top > view.h) continue;
      const style = getComputedStyle(f);
      if (style.visibility !== 'visible' || +style.opacity < .1) continue;
      const current = f.getAttribute('data-net19-ink');
      let color = original.get(f);
      if (!color) color = rgba(!f.value && f.placeholder ? getComputedStyle(f, '::placeholder').color : style.color);
      if (!color || color[3] < .2) continue;
      const bg = backdrop(f);
      if (!bg) continue;
      const pt = parity(f), shown = over(shownAs(color, pt), bg.color);
      const floor = !f.value && f.placeholder ? 2.5 : 3;
      if (ratio(shown, bg.color) >= floor) { if (current) changes.push([f, null]); continue; }
      if (!original.has(f)) original.set(f, color);
      const ink = ratio(shownAs([29, 29, 31, 1], pt), bg.color) >= ratio(shownAs([245, 245, 247, 1], pt), bg.color) ? 'dark' : 'light';
      if (current !== ink) changes.push([f, ink]);
    }
    for (const [el, ink] of changes) {
      const before = inline.get(el);
      if (before) { el.style.setProperty('color', before[0], before[1]); el.style.setProperty('-webkit-text-fill-color', before[2], before[3]); if (!before[0]) el.style.removeProperty('color'); if (!before[2]) el.style.removeProperty('-webkit-text-fill-color'); inline.delete(el); }
      if (!ink) { el.removeAttribute('data-net19-ink'); original.delete(el); continue; }
      el.setAttribute('data-net19-ink', ink);
      if (ink.startsWith('rgb')) {
        inline.set(el, [el.style.getPropertyValue('color'), el.style.getPropertyPriority('color'), el.style.getPropertyValue('-webkit-text-fill-color'), el.style.getPropertyPriority('-webkit-text-fill-color')]);
        el.style.setProperty('color', ink, 'important'); el.style.setProperty('-webkit-text-fill-color', ink, 'important');
      }
    }
    for (const svg of document.querySelectorAll('svg')) {
      if (svg.closest('[data-net19-hidden], a[href] img, picture') || svg.parentElement?.closest('svg')) continue;
      const box = svg.getBoundingClientRect();
      if (box.width < 10 || box.height < 10 || box.width > 64 || box.height > 64 || box.bottom < 0 || box.top > view.h || box.right < 0 || box.left > view.w) continue;
      const current = svg.getAttribute('data-net19-icon');
      const paint = iconColor(svg);
      if (!paint) { if (current) svg.removeAttribute('data-net19-icon'); continue; }
      const bg = backdrop(svg);
      if (!bg) continue;
      const pt = parity(svg), shown = over(shownAs(paint, pt), bg.color);
      if (ratio(shown, bg.color) >= 2.6) { if (current) svg.removeAttribute('data-net19-icon'); continue; }
      const want = ratio(shownAs([29, 29, 31, 1], pt), bg.color) >= ratio(shownAs([232, 234, 237, 1], pt), bg.color) ? 'dark' : 'light';
      if (current !== want) svg.setAttribute('data-net19-icon', want);
    }
  };

  const CONTENT = 'a[href] :is(h1, h2, h3), :is(h1, h2, h3) a[href], article';
  const ROOT_MARKS = /^data-(?:net19|n19)-(?:mode|flip|canvas|recolor|rc|glyph|plain|photo|reading)$/;
  const marks = el => [...el.attributes].filter(a => /^data-(?:net19|n19)-/.test(a.name) && !ROOT_MARKS.test(a.name));
  const intended = typeof theme.intended === 'string' ? theme.intended : '';
  const protectedBlocks = new WeakSet();
  const protect = () => {
    const hiders = new Map();
    for (const item of document.querySelectorAll(CONTENT)) {
      if (item.checkVisibility ? item.checkVisibility() : item.getClientRects().length) continue;
      for (let e = item.parentElement; e && e !== document.body && e !== root; e = e.parentElement) {
        if (getComputedStyle(e).display !== 'none') continue;
        if (intended && e.matches(intended)) break;
        if (marks(e).length || protectedBlocks.has(e)) hiders.set(e, (hiders.get(e) || 0) + 1);
        break;
      }
    }
    for (const [el, count] of hiders) {
      if (count < 3) continue;
      protectedBlocks.add(el);
      for (const a of marks(el)) el.removeAttribute(a.name);
      if (el.style.display === 'none') el.style.removeProperty('display');
      if (getComputedStyle(el).display === 'none') el.style.setProperty('display', 'block', 'important');
    }
  };

  let dirty = true, timer = 0, lastRun = 0;
  const soon = (delay = 250) => {
    if (timer) return;
    timer = setTimeout(() => {
      timer = 0;
      if (!dirty) return;
      const wait = 600 - (performance.now() - lastRun);
      if (wait > 0) { soon(wait); return; }
      dirty = false; lastRun = performance.now();
      (globalThis.requestIdleCallback || (f => f()))(() => { protect(); check(); }, { timeout: 300 });
    }, delay);
  };
  const start = () => {
    (document.head || root).append(inkSheet);
    hideLater(document.body);
    protect();
    new MutationObserver(records => {
      let added = false;
      for (const r of records) {
        if ((r.type === 'attributes' && r.target === root) || r.target === document.head || r.target.parentNode === document.head) continue;
        if (r.attributeName === 'aria-label' || r.attributeName === 'role') { if (later(r.target.getAttribute('aria-label'))) hideLater(r.target); continue; }
        if (r.type === 'childList') {
          textCache = null;
          for (const n of r.addedNodes) { if (n.nodeType === 1) { hideLater(n); added = true; } }
        }
        else if (r.target === root || r.attributeName !== 'data-net19-ink') added = true;
        if (r.type === 'attributes' && r.attributeName === 'placeholder' && ASKING.test(r.target.getAttribute('placeholder') || '')) hideLater(r.target.parentElement || r.target);
      }
      if (added) { dirty = true; soon(); }
    }).observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style', 'hidden', 'open', 'aria-expanded', 'placeholder', 'aria-label', 'role'] });
    new MutationObserver(() => { dirty = true; soon(50); }).observe(root, { attributes: true, attributeFilter: ['data-net19-mode', 'data-net19-recolor', 'class'] });
    for (const type of ['pointerover', 'focusin', 'click', 'keyup']) addEventListener(type, () => soon(), { capture: true, passive: true });
    for (const type of ['transitionend', 'animationend']) addEventListener(type, () => { dirty = true; soon(200); }, { capture: true, passive: true });
    addEventListener('scroll', () => { dirty = true; soon(300); }, { capture: true, passive: true });
    addEventListener('load', () => { dirty = true; soon(100); }, { once: true });
    soon(100);
  };
  if (document.body) start();
  else new MutationObserver((_, observer) => { if (document.body) { observer.disconnect(); start(); } })
    .observe(root || document, { childList: true, subtree: true });
})();
