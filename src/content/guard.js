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
  const later = text => { const t = label(text); return t.length > 1 && t.length < 40 && !keep?.test(t) && (LATER.test(t) || !!extra?.test(t)); };
  const CONTROL = 'button, a, [role="button"], [role="tab"], [role="menuitem"], [role="link"], [role="option"], [class*="chip" i]';
  const ASKING = /^ask (?:gmail|google|photos|drive|maps|youtube|docs)\b|\b(?:or ask\b|ask anything|ask (?:a|any|your) question|ask (?:ai|me|gemini|copilot|rufus)|chat with)/i;
  const hideLater = scope => {
    for (const el of scope.querySelectorAll?.(CONTROL) || []) {
      if (el.hasAttribute('data-net19-hidden')) continue;
      if (later(el.textContent) || later(el.getAttribute('aria-label')) || later(el.getAttribute('title'))) {
        el.setAttribute('data-net19-hidden', '');
        const item = el.parentElement;
        if (item && /^(LI|YT-CHIP-CLOUD-CHIP-RENDERER)$/.test(item.tagName) && item.children.length === 1) item.setAttribute('data-net19-hidden', '');
      }
    }
    for (const field of scope.querySelectorAll?.('input[placeholder], textarea[placeholder]') || []) {
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
  const backdrop = el => {
    const layers = [];
    for (let e = el; e; e = e.parentElement) {
      const style = getComputedStyle(e);
      let shade = null;
      if (style.backgroundImage !== 'none') { shade = gradient(style.backgroundImage); if (!shade) return null; }
      if (e !== el) for (const child of e.children) {
        if (child.matches(MEDIA) || child.querySelector?.(':scope > img, :scope > video, :scope > picture')) {
          const a = child.getBoundingClientRect(), b = el.getBoundingClientRect();
          if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) return null;
        }
      }
      const color = rgba(style.backgroundColor);
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
  const painted = e => { const st = getComputedStyle(e); return /url\(/.test(st.backgroundImage) || ['::before', '::after'].some(p => /url\(/.test(getComputedStyle(e, p).backgroundImage)); };
  const overPicture = (el, box) => {
    const x = Math.min(innerWidth - 1, Math.max(0, box.left + Math.min(box.width, 60) / 2)), y = Math.min(innerHeight - 1, Math.max(0, box.top + box.height / 2));
    for (const hit of document.elementsFromPoint(x, y)) {
      if (hit === el || el.contains(hit)) continue;
      if (hit.matches(MEDIA) || painted(hit)) return true;
      const color = rgba(getComputedStyle(hit).backgroundColor);
      if (color && color[3] >= .95) return false;
    }
    return false;
  };
  const inkSheet = document.createElement('style');
  inkSheet.textContent = '[data-net19-hidden]{display:none!important}' +
    '[data-net19-ink="dark"],[data-net19-ink="dark"] *{color:#1d1d1f!important;-webkit-text-fill-color:#1d1d1f!important}' +
    '[data-net19-ink="light"],[data-net19-ink="light"] *{color:#f5f5f7!important;-webkit-text-fill-color:#f5f5f7!important}' +
    ':is(input,textarea)[data-net19-ink="dark"]{caret-color:#1d1d1f!important}:is(input,textarea)[data-net19-ink="dark"]::placeholder{color:#5f6368!important;-webkit-text-fill-color:#5f6368!important;opacity:1!important}' +
    ':is(input,textarea)[data-net19-ink="light"]{caret-color:#f5f5f7!important}:is(input,textarea)[data-net19-ink="light"]::placeholder{color:#bdc1c6!important;-webkit-text-fill-color:#bdc1c6!important;opacity:1!important}';
  const original = new WeakMap();
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
  const check = () => {
    if (!document.body) return;
    flips = new Map();
    const view = { w: innerWidth, h: innerHeight };
    const changes = [];
    for (const el of textElements()) {
      if (el.closest('script, style, noscript, [data-net19-hidden]')) continue;
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
      const shown = over(shownAs(text, pt), inText);
      const current = el.getAttribute('data-net19-ink');
      const size = parseFloat(style.fontSize), large = size >= 24 || (size >= 18.6 && +style.fontWeight >= 600);
      const chroma = c => Math.max(...c.slice(0, 3)) - Math.min(...c.slice(0, 3));
      const floor = large ? 2.2 : chroma(inText) > 90 || chroma(shown) > 90 ? 2.5 : 3;
      if (ratio(shown, inText) >= floor) { if (current) changes.push([el, null]); continue; }
      if (!current && overPicture(el, box)) continue;
      if (!original.has(el)) original.set(el, text);
      const ink = ratio(shownAs([29, 29, 31, 1], pt), inText) >= ratio(shownAs([245, 245, 247, 1], pt), inText) ? 'dark' : 'light';
      if (current !== ink) changes.push([el, ink]);
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
      if (ink) el.setAttribute('data-net19-ink', ink);
      else { el.removeAttribute('data-net19-ink'); original.delete(el); }
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
        if (r.type === 'childList') {
          textCache = null;
          for (const n of r.addedNodes) { if (n.nodeType === 1) { hideLater(n); added = true; } }
        }
        else if (r.target === root || r.attributeName !== 'data-net19-ink') added = true;
        if (r.type === 'attributes' && r.attributeName === 'placeholder' && ASKING.test(r.target.getAttribute('placeholder') || '')) hideLater(r.target.parentElement || r.target);
      }
      if (added) { dirty = true; soon(); }
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style', 'hidden', 'open', 'aria-expanded', 'placeholder'] });
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
