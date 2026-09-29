import { rgba } from './color.js';

const lin = c => ((c /= 255) <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
const gam = c => 255 * (c <= .0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - .055);
const toLab = ([r, g, b]) => {
  [r, g, b] = [lin(r), lin(g), lin(b)];
  const l = Math.cbrt(.4122214708 * r + .5363325363 * g + .0514459929 * b);
  const m = Math.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * b);
  const s = Math.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * b);
  return [.2104542553 * l + .793617785 * m - .0040720468 * s, 1.9779984951 * l - 2.428592205 * m + .4505937099 * s, .0259040371 * l + .7827717662 * m - .808675766 * s];
};
const fromLab = ([L, a, b]) => {
  const l = (L + .3963377774 * a + .2158037573 * b) ** 3, m = (L - .1055613458 * a - .0638541728 * b) ** 3, s = (L - .0894841775 * a - 1.291485548 * b) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + .2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s, -.0041960863 * l - .7034186147 * m + 1.707614701 * s].map(gam);
};
const inGamut = rgb => rgb.every(v => v >= -.5 && v <= 255.5);
const withLightness = ([L, a, b], next) => {
  let lo = 0, hi = 1, out = fromLab([next, a, b]);
  if (inGamut(out)) return out;
  for (let i = 0; i < 14; i++) {
    const mid = (lo + hi) / 2, test = fromLab([next, a * mid, b * mid]);
    if (inGamut(test)) { lo = mid; out = test; } else hi = mid;
  }
  return lo ? out : fromLab([next, 0, 0]);
};

const CURVES = {
  dark: {
    bg: (L, C) => Math.min(L, Math.max(.95 - .75 * L, C > .12 ? .6 : 0)),
    fg: L => Math.max(L, .92 - .75 * L),
    line: L => Math.min(L, .8 - .6 * L),
  },
  light: {
    bg: (L, C) => Math.max(L, Math.min(1 - .3 * L, C > .12 ? Math.max(L, .55) : 1)),
    fg: L => Math.min(L, 1 - .75 * L),
    line: L => Math.max(L, .95 - .7 * L),
  },
};

export function makeRecolor(target) {
  const curves = CURVES[target];
  const cache = new Map();
  const shift = (value, role) => {
    const key = role + value;
    if (cache.has(key)) return cache.get(key);
    const c = rgba(value);
    let out = null;
    if (c && c[3] > 0) {
      const lab = toLab(c), L = lab[0], C = Math.hypot(lab[1], lab[2]);
      const next = curves[role](L, C);
      if (Math.abs(next - L) > .01) {
        const [r, g, b] = withLightness(lab, next).map(v => Math.round(Math.min(255, Math.max(0, v))));
        out = c[3] < 1 ? `rgba(${r}, ${g}, ${b}, ${+c[3].toFixed(3)})` : `rgb(${r}, ${g}, ${b})`;
      }
    }
    cache.set(key, out);
    return out;
  };
  const gradient = image => {
    if (!image.includes('gradient(')) return null;
    let changed = false;
    const next = image.replace(/url\([^)]*\)|rgba?\([^)]*\)/g, token => {
      if (token.startsWith('url(')) return token;
      const to = shift(token, 'bg');
      if (to) changed = true;
      return to || token;
    });
    return changed ? next : null;
  };
  return { shift, gradient };
}

const SKIP = new Set(['IMG', 'VIDEO', 'CANVAS', 'IFRAME', 'EMBED', 'OBJECT', 'PICTURE', 'SOURCE', 'TRACK', 'SCRIPT', 'STYLE', 'LINK', 'META', 'NOSCRIPT', 'TEMPLATE', 'BR', 'WBR', 'HEAD', 'TITLE', 'image', 'foreignObject', 'mask', 'clipPath', 'defs', 'linearGradient', 'radialGradient', 'stop', 'filter', 'pattern', 'symbol']);
const SIDES = ['top', 'right', 'bottom', 'left'];
const OBSERVE = { childList: true, subtree: true, attributes: true };
const OWN = /^data-net19-(?:rc|glyph|plain|photo|reading|recolor|mode)$/;
const SHAPES = /^(svg|g|path|circle|rect|ellipse|line|polyline|polygon|text|tspan|use)$/;

export function createRecolor(theme) {
  const root = document.documentElement;
  const ATTR = 'data-net19-rc', GLYPH = 'data-net19-glyph', READING = 'data-net19-reading', PLAIN = 'data-net19-plain', PHOTOED = 'data-net19-photo';
  let target = null, tools = null, sheet = null, observer = null;
  const roots = new Set();
  const closedRoot = globalThis.chrome?.dom?.openOrClosedShadowRoot;
  const shadowOf = el => {
    if (el.shadowRoot) return el.shadowRoot;
    if (!closedRoot || !(el instanceof HTMLElement) || !el.localName.includes('-')) return null;
    try { return closedRoot(el) || null; } catch { return null; }
  };
  const ids = new Map();
  const decided = new WeakMap();

  const adopt = host => {
    if (roots.has(host)) return;
    roots.add(host);
    if (!sheet) { sheet = new CSSStyleSheet(); sheet.insertRule(`[${READING}]{transition:none!important}`); sheet.insertRule(`[${PLAIN}]:not(#n19-a):not(#n19-b):not(#n19-c){background-image:none!important}`, 1); }
    host.adoptedStyleSheets = [...host.adoptedStyleSheets, sheet];
    if (host !== document) observer?.observe(host, OBSERVE);
  };
  const reading = fn => {
    if (sheet) sheet.disabled = true;
    try { return fn(); } finally { if (sheet) sheet.disabled = false; }
  };

  const declarations = (cs, pseudo, el) => {
    const out = [];
    const bg = tools.shift(cs.backgroundColor, 'bg');
    if (bg) out.push(['background-color', bg]);
    const image = cs.backgroundImage;
    if (image !== 'none' && image.includes('gradient(')) { const g = tools.gradient(image); if (g) out.push(['background-image', g]); }
    if (!(el && (el.closest('[data-net19-ink]') || surfaceIsPhoto(el)))) {
      const fg = tools.shift(cs.color, 'fg');
      if (fg) out.push(['color', fg], ['-webkit-text-fill-color', fg]);
    }
    if (cs.borderStyle !== 'none') {
      const widths = cs.borderWidth;
      if (widths !== '0px') for (const side of SIDES) {
        if (parseFloat(cs.getPropertyValue(`border-${side}-width`)) > 0) {
          const b = tools.shift(cs.getPropertyValue(`border-${side}-color`), 'line');
          if (b) out.push([`border-${side}-color`, b]);
        }
      }
    }
    if (cs.outlineStyle !== 'none') { const o = tools.shift(cs.outlineColor, 'line'); if (o) out.push(['outline-color', o]); }
    if (!pseudo && el && el.namespaceURI === 'http://www.w3.org/2000/svg') {
      for (const prop of ['fill', 'stroke']) {
        const v = cs.getPropertyValue(prop);
        if (v && v !== 'none' && !v.startsWith('url(')) { const s = tools.shift(v, 'fg'); if (s) out.push([prop, s]); }
      }
    }
    return out;
  };

  let pseudoSelector = null, pseudoOpaque = false;
  const PSEUDO = /::?(?:before|after)\b/gi;
  const COLORED = /background|border|color|outline|fill|stroke|box-shadow/i;
  const scanPseudo = () => {
    const found = new Set();
    pseudoOpaque = false;
    const visit = rules => {
      for (const rule of rules) {
        if (rule.cssRules?.length && !rule.selectorText) { visit(rule.cssRules); continue; }
        const text = rule.selectorText;
        if (!text || !PSEUDO.test(text)) continue;
        PSEUDO.lastIndex = 0;
        if (!COLORED.test(rule.style?.cssText || '')) continue;
        for (const part of text.split(',')) if (/::?(?:before|after)\b/i.test(part)) {
          const base = part.replace(PSEUDO, '').trim() || '*';
          try { document.createDocumentFragment().querySelector(base); found.add(base); } catch { }
        }
      }
    };
    for (const scope of [document, ...[...roots].filter(r => r !== document)]) {
      for (const list of [scope.styleSheets || [], scope.adoptedStyleSheets || []]) for (const sheetItem of list) {
        if (sheetItem === sheet) continue;
        try { visit(sheetItem.cssRules); } catch { pseudoOpaque = true; }
      }
    }
    pseudoSelector = found.size ? [...found].join(',') : '';
  };
  const decorated = el => {
    if (pseudoSelector === null) scanPseudo();
    try { return !!pseudoSelector && el.matches(pseudoSelector); } catch { return false; }
  };
  const measure = (el, cs = getComputedStyle(el)) => {
    const parts = [['', declarations(cs, false, el)]];
    if (el.namespaceURI !== 'http://www.w3.org/2000/svg') {
      if (decorated(el)) for (const pseudo of ['::before', '::after']) {
        const ps = getComputedStyle(el, pseudo);
        if (ps.content && ps.content !== 'none' && ps.content !== 'normal') parts.push([pseudo, declarations(ps, true, null)]);
      }
      if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && el.placeholder) {
        const ps = getComputedStyle(el, '::placeholder');
        const p = tools.shift(ps.color, 'fg');
        if (p) parts.push(['::placeholder', [['color', p], ['-webkit-text-fill-color', p]]]);
      }
    }
    return parts.filter(([, list]) => list.length);
  };

  const ruleFor = parts => {
    const key = JSON.stringify(parts);
    let id = ids.get(key);
    if (id !== undefined) return id;
    id = ids.size.toString(36);
    ids.set(key, id);
    for (const [pseudo, list] of parts) {
      const rule = `[${ATTR}="${id}"]:not(#n19-a):not(#n19-b)${pseudo}{${list.map(([p, v]) => `${p}:${v}!important`).join(';')}}`;
      try { sheet.insertRule(rule, sheet.cssRules.length); } catch { }
    }
    return id;
  };

  const glyphs = new WeakSet();
  const ICON = /\.(png|gif|svg)(\b|[?#])|^data:image\/(png|gif|svg)/i;
  const PHOTO = /\.(jpe?g|webp|avif)(\b|[?#])|^data:image\/(jpeg|webp|avif)|[?&](fm|format)=(jpe?g|webp|avif)/i;
  const inkBySource = new Map();
  const inkOf = src => {
    if (inkBySource.has(src)) return inkBySource.get(src);
    const read = new Promise(resolve => {
      const probe = new Image();
      probe.crossOrigin = 'anonymous';
      probe.onload = () => {
        try {
          const side = 24, pen = new OffscreenCanvas(side, side).getContext('2d', { willReadFrequently: true });
          pen.drawImage(probe, 0, 0, side, side);
          const px = pen.getImageData(0, 0, side, side).data;
          let opaque = 0, colored = 0, sum = 0;
          for (let i = 0; i < px.length; i += 4) {
            if (px[i + 3] < 48) continue;
            opaque++; sum += (px[i] + px[i + 1] + px[i + 2]) / 3;
            if (Math.max(px[i], px[i + 1], px[i + 2]) - Math.min(px[i], px[i + 1], px[i + 2]) > 56) colored++;
          }
          resolve(!opaque ? 'unknown' : colored / opaque > .06 ? 'colorful' : sum / opaque < 128 ? 'dark' : 'light');
        } catch { resolve('unknown'); }
      };
      probe.onerror = () => resolve('unknown');
      probe.src = src;
    });
    inkBySource.set(src, read);
    return read;
  };
  const clashes = ink => (target === 'dark' ? ink === 'dark' : ink === 'light');
  const judgeGlyph = (el, src, w, h) => {
    if (glyphs.has(el) || !src || !ICON.test(src) || !h || h > 64 || w > 160) return;
    glyphs.add(el);
    inkOf(src).then(ink => {
      if (!target) return;
      if (clashes(ink) || (ink === 'unknown' && Math.max(w, h) <= 32 && /\.svg|image\/svg/i.test(src))) el.setAttribute(GLYPH, '');
    });
  };

  let queue = new Set(), shallow = new Set(), below = new Set(), full = false, frame = 0;
  const all = start => {
    if (!start.querySelectorAll) return [];
    const out = start.nodeType === 1 ? [start] : [];
    const walk = scope => {
      for (const el of scope.querySelectorAll('*')) {
        out.push(el);
        const shadow = shadowOf(el);
        if (shadow) { adopt(shadow); walk(shadow); }
      }
    };
    if (start.nodeType === 1) { const shadow = shadowOf(start); if (shadow) { adopt(shadow); walk(shadow); } }
    walk(start);
    return out;
  };
  let work = [], urgent = [], urgentSet = new Set(), workSet = new Set(), glyphWork = [], textureWork = [], pictureWork = [], first = true;
  const exact = new WeakSet(), partsOf = new WeakMap();
  const enqueue = (el, precise, soon = precise) => {
    if (precise) exact.add(el);
    if (soon) { if (!urgentSet.has(el)) { urgentSet.add(el); urgent.push(el); } } else if (!workSet.has(el)) { workSet.add(el); work.push(el); }
  };
  const merge = (old, next) => {
    if (!old) return next;
    const out = new Map(old.map(([pseudo, list]) => [pseudo, new Map(list)]));
    for (const [pseudo, list] of next) { const m = out.get(pseudo) || new Map(); for (const [p, v] of list) m.set(p, v); out.set(pseudo, m); }
    return [...out].map(([pseudo, m]) => [pseudo, [...m]]).filter(([, list]) => list.length);
  };
  const keepSel = ['[data-net19-keep]', theme.keep].filter(Boolean).join(','), reflipSel = theme.reflip || '';
  const kept = el => { try { return !!el.closest(keepSel) && !(reflipSel && el.closest(reflipSel)); } catch { return false; } };
  const read = el => {
    if (!el.isConnected) return null;
    if (kept(el)) return [];
    if (el.tagName === 'IMG') { glyphWork.push([el, el.currentSrc || el.src]); pictureWork.push(el); return measure(el); }
    if (el.tagName === 'VIDEO' || el.tagName === 'PICTURE') pictureWork.push(el);
    if (SKIP.has(el.tagName) || SKIP.has(el.localName)) return null;
    if (el.namespaceURI === 'http://www.w3.org/2000/svg' && !SHAPES.test(el.localName)) return null;
    const cs = getComputedStyle(el);
    if (el.namespaceURI !== 'http://www.w3.org/2000/svg') {
      const m = /url\("?([^")]+)"?\)/.exec(cs.backgroundImage);
      if (m && !PHOTO.test(m[1]) && !el.firstElementChild && !(el.textContent || '').trim()) glyphWork.push([el, m[1]]);
      else if (m) { pictureWork.push(el); if (!PHOTO.test(m[1])) textureWork.push([el, m[1]]); }
    }
    return measure(el, cs);
  };
  const process = () => {
    frame = 0;
    if (!target) return;
    if (full) { full = false; pseudoSelector = null; for (const el of all(root)) enqueue(el, false); }
    for (const n of queue) for (const el of all(n)) enqueue(el, !!decided.get(el), true);
    for (const el of shallow) enqueue(el, true);
    for (const n of below) for (const el of n.getElementsByTagName('*')) enqueue(el, false);
    queue = new Set(); shallow = new Set(); below = new Set();
    const started = performance.now(), budget = first ? 250 : document.readyState === 'complete' ? 30 : 60;
    first = false;
    while ((urgent.length || work.length) && performance.now() - started < budget) {
      const slice = urgent.length ? urgent.splice(0, 200) : work.splice(0, 400);
      for (const el of slice) { workSet.delete(el); urgentSet.delete(el); }
      const careful = slice.filter(el => el.nodeType === 1 && exact.has(el));
      for (const el of careful) el.setAttribute(READING, '');
      const stale = careful.filter(el => decided.get(el));
      for (const el of stale) el.removeAttribute(ATTR);
      const results = slice.map(el => {
        const precise = exact.has(el) || !decided.get(el);
        exact.delete(el);
        let parts = null;
        try { parts = read(el); } catch { }
        return [el, parts && (precise ? parts : merge(partsOf.get(el), parts))];
      });
      for (const [el, parts] of results) {
        if (parts) partsOf.set(el, parts);
        const id = parts && parts.length ? ruleFor(parts) : null;
        const had = decided.get(el) ?? null;
        decided.set(el, id);
        if (id !== null) el.setAttribute(ATTR, id);
        else if (had !== null) el.removeAttribute(ATTR);
      }
      for (const el of careful) if (el.isConnected) getComputedStyle(el).color;
      for (const el of careful) el.removeAttribute(READING);
    }
    if (work.length || urgent.length) frame = requestAnimationFrame(process);
    if (glyphWork.length || textureWork.length || pictureWork.length) (globalThis.requestIdleCallback || setTimeout)(sizeGlyphs, { timeout: 500 });
  };
  const sizeGlyphs = () => {
    const pictures = pictureWork; pictureWork = [];
    const hosts = [];
    const mark = media => {
      const hosts = [];
      const host = hostOf(media);
      if (host && !host.hasAttribute(PHOTOED)) { host.setAttribute(PHOTOED, ''); hosts.push(host); }
      for (const over of overlays(media)) if (!over.hasAttribute(PHOTOED)) { over.setAttribute(PHOTOED, ''); hosts.push(over); }
      for (const h of hosts) for (const el of all(h)) enqueue(el, true);
      if (hosts.length && !frame) frame = requestAnimationFrame(process);
    };
    for (const media of pictures) {
      if (!media.isConnected || pictured.has(media)) continue;
      pictured.add(media);
      if (/^(IMG|VIDEO|PICTURE)$/.test(media.tagName)) { mark(media); continue; }
      if (busy(media)) continue;
      const src = /url\("?([^")]+)"?\)/.exec(getComputedStyle(media).backgroundImage)?.[1];
      if (!src) continue;
      if (PHOTO.test(src)) mark(media);
      else inkOf(src).then(ink => { if (target && ink === 'colorful' && media.isConnected) mark(media); });
    }
    const list = glyphWork; glyphWork = [];
    for (const [el, src] of list) if (el.isConnected) judgeGlyph(el, src, el.offsetWidth, el.offsetHeight);
    const textures = textureWork; textureWork = [];
    for (const [el, src] of textures) {
      if (!el.isConnected || textured.has(el) || el.offsetWidth < 24 || el.offsetHeight < 16) continue;
      textured.add(el);
      inkOf(src).then(ink => { if (target && ink === (target === 'dark' ? 'light' : 'dark')) el.setAttribute(PLAIN, ''); });
    }
  };
  const textured = new WeakSet(), pictured = new WeakSet();
  const busy = host => {
    const r = host.getBoundingClientRect();
    return host === document.body || host === root || (r.width * r.height > .9 * innerWidth * innerHeight && host.getElementsByTagName('*').length > 250);
  };
  const hostOf = media => {
    const box = media.getBoundingClientRect();
    if (box.width < 160 || box.height < 90) return null;
    if (media.firstElementChild) return busy(media) ? null : media;
    let host = null;
    for (let n = media.parentElement, i = 0; n && n !== document.body && i < 6; n = n.parentElement, i++) {
      const q = n.getBoundingClientRect();
      if (Math.abs(q.width - box.width) > Math.max(12, box.width * .12) || Math.abs(q.height - box.height) > Math.max(12, box.height * .12)) break;
      host = n;
    }
    if (!host || busy(host)) return null;
    return (host.textContent || '').trim() ? host : null;
  };
  const overlays = media => {
    const box = media.getBoundingClientRect();
    if (box.width < 300 || box.height < 150 || box.bottom < 0 || box.top > innerHeight * 3) return [];
    const found = new Set();
    for (const fx of [.15, .35, .5, .65, .85]) for (const fy of [.2, .4, .6, .8]) {
      const x = box.left + box.width * fx, y = box.top + box.height * fy;
      if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) continue;
      for (const hit of document.elementsFromPoint(x, y)) {
        if (hit === media || hit.contains(media) || media.contains(hit)) break;
        const bg = rgba(getComputedStyle(hit).backgroundColor);
        if (bg && bg[3] >= .6) break;
        if ([...hit.childNodes].some(n => n.nodeType === 3 && n.data.trim())) found.add(hit);
      }
    }
    return found;
  };
  const surfaceIsPhoto = el => {
    const host = el.closest(`[${PHOTOED}]`);
    if (!host) return false;
    for (let n = el; n && n !== host; n = n.parentElement) {
      const bg = rgba(getComputedStyle(n).backgroundColor);
      if (bg && bg[3] >= .6) return false;
    }
    return true;
  };
  const schedule = (nodes, everything = false) => {
    if (!target) return;
    if (everything) full = true; else for (const n of nodes) if (n?.nodeType === 1) queue.add(n);
    if (!frame) frame = requestAnimationFrame(process);
  };
  const around = el => {
    const out = [];
    for (let n = el, i = 0; n && n.nodeType === 1 && i < 8; n = n.parentElement, i++) out.push(n);
    return out;
  };
  let refreshTimer = 0, lastRefresh = 0;
  const refreshAll = (delay = 300) => {
    clearTimeout(refreshTimer);
    const wait = Math.max(delay, 3000 - (performance.now() - lastRefresh));
    refreshTimer = setTimeout(() => { lastRefresh = performance.now(); schedule([], true); }, wait);
  };

  const onEvent = event => {
    const el = event.composedPath?.()[0] || event.target;
    if (!target || !(el instanceof Element)) return;
    for (const n of around(el)) shallow.add(n);
    const inside = el.getElementsByTagName('*');
    if (inside.length <= 200) schedule([el]); else { shallow.add(el); schedule([]); }
  };
  let stylesTimer = 0, lastStyles = 0;
  const onStyles = () => {
    if (stylesTimer) return;
    stylesTimer = setTimeout(() => { stylesTimer = 0; lastStyles = performance.now(); schedule([], true); }, Math.max(200, 1000 - (performance.now() - lastStyles)));
  };
  const onLoad = event => { if (event.target instanceof HTMLLinkElement && event.target.rel === 'stylesheet') refreshAll(document.readyState === 'complete' ? 2000 : 300); };

  const baseRules = () => {
    const canvas = target === 'dark' ? 'rgb(24, 24, 24)' : 'rgb(255, 255, 255)';
    const bare = reading(() => [root, document.body].every(n => !n || (rgba(getComputedStyle(n).backgroundColor) || [0, 0, 0, 0])[3] === 0));
    const flat = theme.flat ? `,${theme.flat}` : '';
    return `html[data-net19-recolor]{color-scheme:${target}!important${bare ? `;background-color:${canvas}!important` : ''}}` +
      `html[data-net19-recolor] :is([${GLYPH}]${flat}){filter:invert(1) hue-rotate(180deg)!important}`;
  };

  let base = null;
  const start = mode => {
    if (target === mode) return;
    stop();
    target = mode;
    tools = makeRecolor(mode);
    root.setAttribute('data-net19-recolor', mode);
    base = document.createElement('style');
    base.id = 'net19-recolor-base';
    (document.head || root).append(base);
    base.textContent = baseRules();
    observer = new MutationObserver(records => {
      const nodes = [];
      let sheets = false;
      for (const r of records) {
        if (r.type === 'childList') {
          for (const n of r.addedNodes) {
            if (n.nodeType !== 1 || n === base) continue;
            if (n.tagName === 'STYLE' || n.tagName === 'LINK') sheets = true; else nodes.push(n);
          }
        } else if (!OWN.test(r.attributeName)) { shallow.add(r.target); below.add(r.target); }
      }
      if (sheets) refreshAll(document.readyState === 'complete' ? 2000 : 300);
      schedule(nodes);
    });
    observer.observe(root, OBSERVE);
    adopt(document);
    schedule([], true);
    for (const type of ['pointerover', 'pointerout', 'focusin', 'focusout', 'pointerdown', 'pointerup', 'keyup', 'transitionend', 'animationend']) addEventListener(type, onEvent, { capture: true, passive: true });
    addEventListener('load', onLoad, true);
    document.addEventListener('net19-css', onStyles);
    addEventListener('load', () => { if (base) base.textContent = baseRules(); refreshAll(0); setTimeout(() => refreshAll(0), 2500); }, { once: true });
    document.addEventListener('DOMContentLoaded', () => { if (base) base.textContent = baseRules(); refreshAll(0); }, { once: true });
  };
  const stop = () => {
    if (!target) return;
    target = null; tools = null;
    observer?.disconnect(); observer = null;
    for (const type of ['pointerover', 'pointerout', 'focusin', 'focusout', 'pointerdown', 'pointerup', 'keyup', 'transitionend', 'animationend']) removeEventListener(type, onEvent, { capture: true });
    removeEventListener('load', onLoad, true);
    document.removeEventListener('net19-css', onStyles);
    cancelAnimationFrame(frame); frame = 0; queue = new Set(); shallow = new Set(); below = new Set(); full = false; work = []; urgent = []; urgentSet = new Set(); workSet = new Set(); glyphWork = []; textureWork = []; pictureWork = []; first = true;
    for (const host of roots) {
      for (const el of host.querySelectorAll?.(`[${ATTR}],[${GLYPH}],[${PLAIN}],[${PHOTOED}]`) || []) for (const a of [ATTR, GLYPH, PLAIN, PHOTOED]) el.removeAttribute(a);
      host.adoptedStyleSheets = host.adoptedStyleSheets.filter(s => s !== sheet);
    }
    roots.clear(); ids.clear(); inkBySource.clear();
    sheet = null; base?.remove(); base = null;
    root.removeAttribute('data-net19-recolor');
  };
  return {
    start, stop,
    active: () => target,
    refresh: () => schedule([], true),
    pause: fn => reading(() => { const s = base?.sheet; if (s) s.disabled = true; try { return fn(); } finally { if (s) s.disabled = false; } }),
  };
}
