(() => {
  const theme = globalThis.net19Theme;
  if (!theme || globalThis.net19PaletteStarted) return;
  globalThis.net19PaletteStarted = true;
  const STYLE_ID = 'net19-palette';
  const canvas = document.createElement('canvas').getContext('2d');
  const normal = value => {
    const text = String(value).trim().toLowerCase();
    if (!/^(#|rgb|hsl)/.test(text)) return null;
    canvas.fillStyle = '#010203';
    canvas.fillStyle = text;
    const result = canvas.fillStyle;
    return result === '#010203' && text !== '#010203' ? null : result;
  };
  const tables = {};
  for (const mode of ['light', 'dark']) {
    tables[mode] = new Map();
    for (const [from, to] of Object.entries(theme[mode] || {})) { const key = normal(from); if (key) tables[mode].set(key, to); }
  }
  const luminance = color => {
    const hex = normal(color);
    if (!hex || !hex.startsWith('#')) return null;
    const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
    return (.2126 * r + .7152 * g + .0722 * b) / 255;
  };
  const detect = () => {
    const decided = theme.detect?.();
    if (decided === 'dark' || decided === 'light') return decided;
    const bg = luminance(getComputedStyle(document.body || document.documentElement).backgroundColor);
    return bg !== null && bg < .35 ? 'dark' : 'light';
  };
  const hasMap = tables.light.size > 0 || tables.dark.size > 0;
  let sheet = null;
  let lastMode = '';
  const siteValues = () => {
    if (sheet?.sheet) sheet.sheet.disabled = true;
    const values = [];
    const root = document.documentElement;
    for (const selector of ['html', 'body', ...(theme.scopes || [])]) {
      const node = selector === 'html' ? root : document.querySelector(selector);
      if (!node) continue;
      const style = getComputedStyle(node);
      for (let i = 0; i < style.length; i++) {
        const name = style[i];
        if (name.charCodeAt(0) === 45 && name.charCodeAt(1) === 45) values.push([name, style.getPropertyValue(name)]);
      }
    }
    if (sheet?.sheet) sheet.sheet.disabled = false;
    return values;
  };
  const device = matchMedia('(prefers-color-scheme: dark)');
  const FLIP = 'invert(1) hue-rotate(180deg) contrast(.88)';
  const UNFLIP = 'contrast(1.13636) hue-rotate(180deg) invert(1)';
  const MEDIA = 'img,video,canvas,iframe,embed,object,image,[data-net19-keep]';
  const flipCSS = `html[data-net19-flip]{filter:${FLIP}!important}` +
    `html[data-net19-flip] :is(dialog:modal,:popover-open,:fullscreen):not(${MEDIA}){filter:${FLIP}!important}` +
    `html[data-net19-flip] :is(${MEDIA}):not([data-net19-keep] *,:fullscreen,img[src*=".svg" i],img[src^="data:image/svg" i],[data-net19-flat]${theme.flat ? ',' + theme.flat : ''}){filter:${UNFLIP}!important}` +
    `html[data-net19-flip] [data-net19-keep] [data-net19-reflip]{filter:${FLIP}!important}` +
    `html[data-net19-flip] [data-net19-reflip] :is(${MEDIA}){filter:${UNFLIP}!important}`;
  let flipSheet = null, keepObserver = null, target = 'dark', interactions = false;
  const colorCache = new Map();
  let pen = null;
  const rgba = color => {
    color = String(color);
    if (/^rgba?\(/.test(color)) { const m = color.match(/[\d.]+/g); return m ? [+m[0], +m[1], +m[2], m.length > 3 ? +m[3] : 1] : null; }
    if (!/^(?:color|oklab|oklch|lab|lch|hsla?|hwb)\(/.test(color)) return null;
    if (colorCache.has(color)) return colorCache.get(color);
    let out = null;
    try {
      pen ||= new OffscreenCanvas(1, 1).getContext('2d', { willReadFrequently: true });
      pen.clearRect(0, 0, 1, 1); pen.fillStyle = color; pen.fillRect(0, 0, 1, 1);
      const d = pen.getImageData(0, 0, 1, 1).data;
      out = d[3] ? [Math.round(d[0] * 255 / d[3]), Math.round(d[1] * 255 / d[3]), Math.round(d[2] * 255 / d[3]), d[3] / 255] : [0, 0, 0, 0];
    } catch { out = null; }
    colorCache.set(color, out); return out;
  };
  const lum = ([r, g, b]) => (.2126 * r + .7152 * g + .0722 * b) / 255;
  const unflip = ([r, g, b, a]) => {
    const [cr, cg, cb] = [r, g, b].map(v => Math.min(1, Math.max(0, (v / 255 - .5) / .88 + .5)));
    const [hr, hg, hb] = [-.574 * cr + 1.43 * cg + .144 * cb, .426 * cr + .43 * cg + .144 * cb, .426 * cr + 1.43 * cg - .856 * cb];
    return `rgba(${[hr, hg, hb].map(v => Math.round(255 * (1 - Math.min(1, Math.max(0, v))))).join(',')},${a})`;
  };
  const scrims = new Map();
  const scrim = color => {
    let id = scrims.get(color);
    if (id === undefined) {
      id = scrims.size; scrims.set(color, id);
      flipSheet.textContent += `html[data-net19-flip] [data-net19-scrim="${id}"]{background-color:${unflip(rgba(color))}!important}`;
    }
    return id;
  };
  let seen = new WeakSet(), small = new Set();
  const DRAWN = /\.(png|gif|svg)(\b|[?#"'])|image\/(png|gif|svg)/i;
  const PHOTO = /\.(jpe?g|webp|avif)(\b|[?#"'])|image\/(jpeg|webp|avif)|[?&](fm|format)=(jpe?g|webp|avif)/i;
  const flatIcon = img => {
    const src = img.currentSrc || img.src || '';
    if (!/\.(png|gif)(\b|[?#])|^data:image\/(png|gif)/i.test(src)) return;
    const judge = () => { if (img.offsetHeight > 0 && img.offsetHeight <= 120 && img.offsetWidth <= 400) img.setAttribute('data-net19-flat', ''); };
    if (img.complete) judge(); else img.addEventListener('load', judge, { once: true });
  };
  const SKIP = /^(IMG|VIDEO|CANVAS|IFRAME|SVG|svg|PATH|path|SCRIPT|STYLE|LINK|META|BR)$/;
  const keepSel = theme.keep || '', reflipSel = theme.reflip || '';
  const sizes = new ResizeObserver(entries => {
    for (const { target: media, contentRect: box } of entries) {
      if (box.width < 2 || box.height < 2) continue;
      sizes.unobserve(media);
      if (!media.isConnected || !document.documentElement.hasAttribute('data-net19-flip') || media.hasAttribute('data-net19-flat')) continue;
      const d = new Map();
      overlaid(media, d, e => (e.closest('[data-net19-keep]') ? 'kept' : 'flipped'));
      for (const [e, v] of d) e.setAttribute(`data-net19-${v}`, '');
    }
  });
  const judgedAt = new WeakMap();
  const rescanMedia = () => {
    if (!document.documentElement.hasAttribute('data-net19-flip')) return;
    const d = new Map();
    const outside = e => (e.closest('[data-net19-keep]') ? 'kept' : 'flipped');
    for (const media of document.querySelectorAll('img, video, canvas')) {
      if (media.closest('[data-net19-keep]') || media.hasAttribute('data-net19-flat')) continue;
      const size = `${media.offsetWidth}x${media.offsetHeight}`;
      if (judgedAt.get(media) === size) continue;
      judgedAt.set(media, size);
      if (overlaid(media, d, outside) || media.offsetWidth < 120 || media.offsetHeight < 64) continue;
      for (const shade of shadesNear(media)) if (!d.has(shade) && !shade.closest('[data-net19-keep]') && shadeOver(shade)) d.set(shade, 'keep');
    }
    for (const [e, v] of d) e.setAttribute(`data-net19-${v}`, '');
  };
  const shadesNear = media => {
    const found = [];
    for (let n = media.parentElement, i = 0; n && n !== document.body && i < 3; n = n.parentElement, i++) {
      const all = n.getElementsByTagName('*');
      if (all.length > 60) break;
      for (const e of all) {
        if (e === media || e.contains(media)) continue;
        const image = getComputedStyle(e).backgroundImage;
        if (image.includes('gradient(') && !image.includes('url(')) found.push(e);
      }
    }
    return found;
  };
  const shadeOver = el => {
    const r = el.getBoundingClientRect();
    if (r.width < 96 || r.height < 48) return false;
    for (let n = el.parentElement, i = 0; n && n !== document.body && i < 3; n = n.parentElement, i++) {
      if (n.getElementsByTagName('*').length > 60) break;
      for (const m of n.querySelectorAll('img, video, picture > img')) {
        if (el.contains(m)) continue;
        const q = m.getBoundingClientRect();
        const ox = Math.min(q.right, r.right) - Math.max(q.left, r.left), oy = Math.min(q.bottom, r.bottom) - Math.max(q.top, r.top);
        if (ox > 0 && oy > 0 && ox * oy > .25 * r.width * r.height && q.width >= 120 && q.height >= 64) return true;
      }
    }
    return false;
  };
  const overlaid = (media, decided, context) => {
    const r = media.getBoundingClientRect();
    if (r.width < 120 || r.height < 64) {
      if (r.width < 2 || r.height < 2 || (media.tagName === 'IMG' && !media.complete)) sizes.observe(media);
      return false;
    }
    if (media.hasAttribute('data-net19-flat')) return false;
    let host = null;
    for (let n = media.parentElement, i = 0; n && n !== document.body && i < 6; n = n.parentElement, i++) {
      const q = n.getBoundingClientRect();
      if ((q.width < 1 && q.height < 1) || n.tagName === 'PICTURE') continue;
      if (Math.abs(q.width - r.width) > Math.max(8, r.width * .08) || Math.abs(q.height - r.height) > Math.max(8, r.height * .08)) break;
      host = n;
    }
    if (!host || !host.querySelector(':scope *:not(img, picture, source, video, canvas, svg, svg *)')) return false;
    const text = (host.textContent || '').replace(/\s+/g, ' ').trim();
    const hr = host.getBoundingClientRect();
    if (text.length > 2000 || host.getElementsByTagName('*').length > 250 || host.querySelector('[role="navigation"], nav, main, [role="main"]') ||
      hr.width * hr.height > .85 * innerWidth * innerHeight) return false;
    if (!text && !host.querySelector('[style*="gradient"], [class*="gradient" i], [class*="overlay" i], [class*="shade" i]')) return false;
    if (context(host) !== 'flipped' || host.closest('[data-net19-keep]')) return false;
    decided.set(host, 'keep');
    return true;
  };
  const keepPhotos = roots => {
    const decided = new Map(), scrimColor = new Map();
    const context = el => {
      for (let n = el.parentElement, i = 0; n && i < 40; n = n.parentElement, i++) {
        const d = decided.get(n) || (n.hasAttribute('data-net19-reflip') ? 'reflip' : n.hasAttribute('data-net19-keep') ? 'keep' : '');
        if (d === 'keep') return 'kept';
        if (d === 'reflip') return 'none';
      }
      return 'flipped';
    };
    for (const root of roots) {
      if (!root?.isConnected) continue;
      const grown = [];
      for (let n = root.parentElement, i = 0; n && i < 8; n = n.parentElement, i++) if (small.has(n)) { small.delete(n); seen.delete(n); grown.unshift(n); }
      const list = root.querySelectorAll ? [...grown, root, ...root.querySelectorAll('*')] : grown;
      for (const el of list) {
        if (seen.has(el)) continue;
        seen.add(el);
        if (el.tagName === 'IMG' || el.tagName === 'VIDEO' || el.tagName === 'CANVAS') {
          if (el.tagName === 'IMG') flatIcon(el);
          overlaid(el, decided, context);
          continue;
        }
        if (el === document.body) continue;
        if (SKIP.test(el.tagName) || el.hasAttribute('data-net19-keep') || el.hasAttribute('data-net19-reflip') || el.hasAttribute('data-net19-scrim')) continue;
        if (keepSel && el.matches(keepSel)) { if (context(el) === 'flipped') decided.set(el, 'keep'); continue; }
        if (reflipSel && el.matches(reflipSel)) { if (context(el) === 'kept') decided.set(el, 'reflip'); continue; }
        const style = getComputedStyle(el);
        const image = style.backgroundImage;
        if (!image.includes('url(') && image.includes('gradient(') && shadeOver(el) && context(el) === 'flipped') { decided.set(el, 'keep'); continue; }
        const photo = image.includes('url(') && !DRAWN.test(image);
        const surely = photo && PHOTO.test(image);
        const color = photo ? null : rgba(style.backgroundColor);
        if (!photo && (!color || color[3] < .15)) continue;
        const l = color && lum(color);
        const vivid = color && color[3] >= .9 && Math.max(color[0], color[1], color[2]) - Math.min(color[0], color[1], color[2]) > 90;
        const suits = color && (vivid || (target === 'dark' ? l < .36 : l > .75));
        const opposite = color && color[3] >= .9 && (target === 'dark' ? l > .75 : l < .3);
        if (!photo && !suits && !opposite) continue;
        const where = context(el);
        if (where === 'none' || (where === 'flipped' && !photo && !suits) || (where === 'kept' && !opposite)) continue;
        const w = el.offsetWidth, h = el.offsetHeight;
        if (w < 96 || h < 24 || (photo && h < (surely ? 64 : 200))) { small.add(el); continue; }
        if (where === 'kept') decided.set(el, 'reflip');
        else if (photo) { if (!overlaid(el, decided, context)) decided.set(el, 'keep'); }
        else if (color[3] >= .9) decided.set(el, 'keep');
        else { decided.set(el, 'scrim'); scrimColor.set(el, style.backgroundColor); }
      }
    }
    for (const [el, d] of decided) {
      if (d === 'scrim') el.setAttribute('data-net19-scrim', scrim(scrimColor.get(el)));
      else el.setAttribute(`data-net19-${d}`, '');
    }
  };
  const setFlip = (on, mode) => {
    const root = document.documentElement;
    if (on === root.hasAttribute('data-net19-flip') && (!on || mode === target)) return;
    keepObserver?.disconnect(); keepObserver = null;
    for (const el of document.querySelectorAll('[data-net19-keep],[data-net19-reflip],[data-net19-scrim],[data-net19-flat]')) for (const a of ['data-net19-keep', 'data-net19-reflip', 'data-net19-scrim', 'data-net19-flat']) el.removeAttribute(a);
    seen = new WeakSet(); small = new Set();
    if (!on) { root.removeAttribute('data-net19-flip'); root.removeAttribute('data-net19-canvas'); return; }
    target = mode;
    if (!flipSheet) {
      flipSheet = document.createElement('style'); flipSheet.id = 'net19-flip';
      flipSheet.textContent = flipCSS + 'html[data-net19-flip][data-net19-canvas]{background-color:#fff!important}';
      (document.head || root).append(flipSheet);
    }
    root.setAttribute('data-net19-flip', '');
    const canvas = () => {
      const bare = [root, document.body].every(n => !n || (rgba(getComputedStyle(n).backgroundColor) || [0, 0, 0, 0])[3] === 0);
      if (bare) root.setAttribute('data-net19-canvas', '');
    };
    canvas();
    addEventListener('load', canvas, { once: true });
    let added = [document.body], frame = 0;
    const flush = () => { frame = 0; const roots = added; added = []; keepPhotos(roots); };
    frame = requestAnimationFrame(flush);
    keepObserver = new MutationObserver(records => {
      for (const r of records) for (const n of r.addedNodes) if (n.nodeType === 1) added.push(n);
      if (added.length && !frame) frame = requestAnimationFrame(flush);
    });
    keepObserver.observe(document.body || root, { childList: true, subtree: true });
    if (!interactions) {
      interactions = true;
      const recheck = () => setTimeout(() => requestAnimationFrame(() => {
        if (!document.documentElement.hasAttribute('data-net19-flip')) return;
        const opened = [];
        for (const el of small) {
          if (!el.isConnected) { small.delete(el); continue; }
          if (el.offsetWidth >= 96 && el.offsetHeight >= 24) { small.delete(el); seen.delete(el); opened.push(el); }
        }
        if (opened.length) keepPhotos(opened);
      }), 250);
      for (const type of ['click', 'keyup', 'focusin']) addEventListener(type, recheck, { capture: true, passive: true });
    }
    addEventListener('load', () => { keepPhotos([document.body]); rescanMedia(); setTimeout(rescanMedia, 2000); }, { once: true });
    if (document.readyState === 'complete') setTimeout(rescanMedia, 1000);
  };
  theme.rejudge = () => {
    if (!document.documentElement.hasAttribute('data-net19-flip')) return;
    for (const el of document.querySelectorAll('[data-net19-keep],[data-net19-reflip],[data-net19-scrim]')) for (const a of ['data-net19-keep', 'data-net19-reflip', 'data-net19-scrim']) el.removeAttribute(a);
    seen = new WeakSet(); small = new Set();
    keepPhotos([document.body]);
  };
  const apply = (force = false) => {
    const root = document.documentElement;
    if (!root) return;
    if (sheet?.sheet) sheet.sheet.disabled = true;
    const mode = detect();
    if (sheet?.sheet) sheet.sheet.disabled = false;
    if (root.getAttribute('data-net19-mode') !== mode) root.setAttribute('data-net19-mode', mode);
    const fixed = typeof theme.only === 'function' ? theme.only() : theme.only;
    const wanted = fixed === 'dark' || fixed === 'light' ? fixed : device.matches ? 'dark' : 'light';
    setFlip(wanted !== mode, wanted);
    if (!hasMap || mode === lastMode && !force) return;
    lastMode = mode;
    const table = tables[mode];
    const declared = new Map();
    for (const [name, value] of siteValues()) {
      if (declared.has(name)) continue;
      const to = table.get(normal(value));
      if (to) declared.set(name, to);
    }
    const body = [...declared].map(([name, to]) => `${name}:${to} !important`).join(';');
    const selectors = ['html:root', ...(theme.scopes || []).map(s => `html ${s}`)].join(',');
    if (!sheet) { sheet = document.createElement('style'); sheet.id = STYLE_ID; (document.head || root).append(sheet); }
    const text = body ? `${selectors}{${body}}` : '';
    if (sheet.textContent !== text) sheet.textContent = text;
  };
  let queued = false, rescan = false, timer = 0;
  const later = full => {
    rescan = rescan || full;
    if (full && !timer) timer = setTimeout(() => { timer = 0; run(); }, 400);
    if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; if (!timer) run(); }); }
  };
  const run = () => { const full = rescan; rescan = false; apply(full); };
  const watch = () => {
    apply(true);
    const observer = new MutationObserver(records => {
      let attributes = false, sheets = false;
      for (const r of records) {
        if (r.type === 'attributes' && r.attributeName !== 'data-net19-mode' && r.attributeName !== 'data-net19-flip') attributes = true;
        else if (r.type === 'childList') for (const n of r.addedNodes) if (n !== sheet && n !== flipSheet && (n.nodeName === 'STYLE' || n.nodeName === 'LINK')) sheets = true;
      }
      if (attributes || sheets) later(sheets);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: theme.watch || ['class', 'dark', 'data-color-mode', 'data-theme', 'style'] });
    if (hasMap && document.head) observer.observe(document.head, { childList: true });
    if (document.body) observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });
    addEventListener('load', () => later(true), { once: true });
    device.addEventListener?.('change', () => later(true));
  };
  if (document.body) watch();
  else new MutationObserver((_, observer) => { if (document.body) { observer.disconnect(); watch(); } })
    .observe(document.documentElement || document, { childList: true, subtree: true });
})();
