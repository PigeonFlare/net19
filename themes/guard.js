// net19 guard: three safety nets shared by every theme, running after the theme and palette.js.
//
// 1. Features that did not exist in 2019 (AI assistants, image generation, "ask" search) are hidden wherever a site
//    shows them, by their visible label, and search fields that invite questions go back to plain "Search". Themes
//    hide what they know about; this catches what a site adds later or shows only to some accounts.
// 2. Readability: after the theme, the light/dark flip and every interaction (a menu opening on hover, a search list),
//    visible text is checked against the background it actually sits on. Text that has become unreadable (a theme
//    rule reaching into a menu it was not written for, a panel kept as drawn inside a flipped page) is given a dark or
//    light ink that reads on that background. Text over photos and gradients is left alone: its background is unknown.
// 3. Content protection: a theme's hiding marker that lands on a block of real page content (several linked headings
//    or articles) is taken back, so a rule meant for one post-2019 widget can never wipe the page.
(() => {
  const theme = globalThis.net19Theme;
  if (!theme || globalThis.net19GuardStarted) return;
  globalThis.net19GuardStarted = true;
  const root = document.documentElement;

  // ---- 1. Post-2019 features -------------------------------------------------------------------------------------
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

  // ---- 2. Readability --------------------------------------------------------------------------------------------
  // Computed colors come back as rgb()/rgba() for sRGB, but as oklab(), oklch(), lab() or color() when a site writes
  // them that way (Tailwind v4). Those are converted by painting one pixel, and cached.
  const colorCache = new Map();
  let pen = null;
  const rgba = c => {
    c = String(c);
    if (/^rgba?\(/.test(c)) { const m = c.match(/[\d.]+/g); return m && m.length >= 3 ? [+m[0], +m[1], +m[2], m.length > 3 ? +m[3] : 1] : null; }
    if (!/^(?:oklab|oklch|lab|lch|color|hsla?|hwb)\(/.test(c)) return null;
    if (colorCache.has(c)) return colorCache.get(c);
    try {
      pen ||= new OffscreenCanvas(1, 1).getContext('2d', { willReadFrequently: true });
      pen.clearRect(0, 0, 1, 1); pen.fillStyle = c; pen.fillRect(0, 0, 1, 1);
      const d = pen.getImageData(0, 0, 1, 1).data;
      const out = d[3] ? [Math.round(d[0] * 255 / d[3]), Math.round(d[1] * 255 / d[3]), Math.round(d[2] * 255 / d[3]), d[3] / 255] : [0, 0, 0, 0];
      colorCache.set(c, out); return out;
    } catch { return null; }
  };
  const channel = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; };
  const lum = c => .2126 * channel(c[0]) + .7152 * channel(c[1]) + .0722 * channel(c[2]);
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const over = (top, under) => { const a = top[3]; return [0, 1, 2].map(i => top[i] * a + under[i] * (1 - a)).concat(1); };
  // palette.js's page flip, invert(1) hue-rotate(180deg) contrast(.88), applied to one color: how a color written in a
  // flipped part is shown on screen. Hue-rotate changes lightness a lot for strong colors (a pink turns light pink, not
  // the teal that a plain inversion gives), so the whole filter is computed.
  const flip = ([r, g, b, a]) => {
    const [ir, ig, ib] = [r, g, b].map(v => 1 - v / 255);
    const rot = [-.574 * ir + 1.43 * ig + .144 * ib, .426 * ir + .43 * ig + .144 * ib, .426 * ir + 1.43 * ig - .856 * ib];
    return rot.map(v => Math.round(255 * Math.min(1, Math.max(0, (Math.min(1, Math.max(0, v)) - .5) * .88 + .5)))).concat(a);
  };
  const shownAs = (c, p) => (p ? flip(c) : c);
  // Whether an element is shown inverted: every invert() filter on it or an ancestor turns it over once (the page flip,
  // the turned-back photos inside it, a theme's own filters). Read from computed filters and cached for one check.
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
  // A gradient behind text (a header shading from one blue to another) is taken as the average of its colors.
  const gradient = image => {
    if (/url\(/.test(image) || !/gradient\(/.test(image)) return null;
    const stops = (image.match(/rgba?\([^)]*\)/g) || []).map(rgba).filter(Boolean);
    if (!stops.length) return null;
    return [0, 1, 2, 3].map(i => stops.reduce((sum, c) => sum + c[i], 0) / stops.length);
  };
  const MEDIA = 'img, picture, video, canvas, svg image, iframe';
  // The solid color behind an element, or null when a photo, gradient or media element may be behind it.
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
    // Composited as shown on screen: each layer through the filters that apply to it.
    let base = shownAs([255, 255, 255, 1], parity(root));
    const last = layers[layers.length - 1];
    if (last && last.color[3] >= .95) { base = shownAs(last.color, parity(last.el)); layers.pop(); }
    for (let i = layers.length - 1; i >= 0; i--) base = over(shownAs(layers[i].color, parity(layers[i].el)), base);
    return { color: base };
  };
  // Before changing any text: whatever is painted under its middle (sibling layers included) must not be a picture.
  const painted = e => { const st = getComputedStyle(e); return /url\(/.test(st.backgroundImage) || ['::before', '::after'].some(p => /url\(/.test(getComputedStyle(e, p).backgroundImage)); };
  const overPicture = (el, box) => {
    const x = Math.min(innerWidth - 1, Math.max(0, box.left + Math.min(box.width, 60) / 2)), y = Math.min(innerHeight - 1, Math.max(0, box.top + box.height / 2));
    for (const hit of document.elementsFromPoint(x, y)) {
      if (hit === el || el.contains(hit)) continue;
      if (hit.matches(MEDIA) || painted(hit)) return true;
      const color = rgba(getComputedStyle(hit).backgroundColor);
      if (color && color[3] >= .95) return false;   // an opaque surface ends the stack below the text
    }
    return false;
  };
  const inkSheet = document.createElement('style');
  inkSheet.textContent = '[data-net19-hidden]{display:none!important}' +
    '[data-net19-ink="dark"],[data-net19-ink="dark"] *{color:#1d1d1f!important;-webkit-text-fill-color:#1d1d1f!important}' +
    '[data-net19-ink="light"],[data-net19-ink="light"] *{color:#f5f5f7!important;-webkit-text-fill-color:#f5f5f7!important}' +
    // Fields: typed text, the caret and the placeholder.
    ':is(input,textarea)[data-net19-ink="dark"]{caret-color:#1d1d1f!important}:is(input,textarea)[data-net19-ink="dark"]::placeholder{color:#5f6368!important;-webkit-text-fill-color:#5f6368!important;opacity:1!important}' +
    ':is(input,textarea)[data-net19-ink="light"]{caret-color:#f5f5f7!important}:is(input,textarea)[data-net19-ink="light"]::placeholder{color:#bdc1c6!important;-webkit-text-fill-color:#bdc1c6!important;opacity:1!important}';
  const original = new WeakMap();
  const textElements = () => {
    const found = new Set();
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
      const pt = parity(el), inText = bg.color;   // the surface as shown
      const shown = over(shownAs(text, pt), inText);
      const current = el.getAttribute('data-net19-ink');
      // WCAG's floor for large text (24px, or 18.66px bold) is 3:1 and for the rest 4.5:1; net19 repairs what falls
      // below 2.2:1 and 3:1, the same limits as the lowcontrast page check.
      const size = parseFloat(style.fontSize), large = size >= 24 || (size >= 18.6 && +style.fontWeight >= 600);
      // White or black lettering on a strong brand color (Twitter's blue buttons, WhatsApp's green bar) is how those
      // sites drew it in 2019 and reads well from 2.5:1.
      // A strong brand color as the text itself (Twitter's #1da1f2 links, Healthline's teal labels) reads the same way.
      const chroma = c => Math.max(...c.slice(0, 3)) - Math.min(...c.slice(0, 3));
      const floor = large ? 2.2 : chroma(inText) > 90 || chroma(shown) > 90 ? 2.5 : 3;
      if (ratio(shown, inText) >= floor) { if (current) changes.push([el, null]); continue; }
      if (!current && overPicture(el, box)) continue;
      if (!original.has(el)) original.set(el, text);
      const ink = ratio(shownAs([29, 29, 31, 1], pt), inText) >= ratio(shownAs([245, 245, 247, 1], pt), inText) ? 'dark' : 'light';
      if (current !== ink) changes.push([el, ink]);
    }
    // Fields: what shows is the typed text, or the placeholder while empty.
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

  // ---- 3. Content protection -------------------------------------------------------------------------------------
  // Themes hide post-2019 features by marking blocks (data-net19-hidden, or a theme's own data-net19-* / data-n19-*
  // marker that its stylesheet hides). A marker that lands on a block holding the page's real content, such as a
  // wrapper around several search results or articles, would wipe the page (a Google query whose AI Overview shared a
  // wrapper with the results lost the whole first page). Such a marker is taken back and the block stays visible.
  const CONTENT = 'a[href] :is(h1, h2, h3), :is(h1, h2, h3) a[href], article';
  const ROOT_MARKS = /^data-(?:net19|n19)-(?:mode|flip|canvas)$/;
  const marks = el => [...el.attributes].filter(a => /^data-(?:net19|n19)-/.test(a.name) && !ROOT_MARKS.test(a.name));
  const protectedBlocks = new WeakSet();
  const protect = () => {
    const hiders = new Map();
    for (const item of document.querySelectorAll(CONTENT)) {
      if (item.checkVisibility ? item.checkVisibility() : item.getClientRects().length) continue;
      for (let e = item.parentElement; e && e !== document.body && e !== root; e = e.parentElement) {
        if (getComputedStyle(e).display !== 'none') continue;
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
      console.warn('net19: kept a block of page content that a theme rule tried to hide', el);
    }
  };

  // ---- Scheduling ------------------------------------------------------------------------------------------------
  // Hiding runs on every batch of new content, before it is painted. The readability check runs when the page has
  // settled after a change (load, the mode or flip changing, a menu or list opening), at most every 600 ms.
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
        if (r.type === 'childList') for (const n of r.addedNodes) { if (n.nodeType === 1) { hideLater(n); added = true; } }
        else if (r.target === root || r.attributeName !== 'data-net19-ink') added = true;
        if (r.type === 'attributes' && r.attributeName === 'placeholder' && ASKING.test(r.target.getAttribute('placeholder') || '')) hideLater(r.target.parentElement || r.target);
      }
      if (added) { dirty = true; soon(); }
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style', 'hidden', 'open', 'aria-expanded', 'placeholder'] });
    new MutationObserver(() => { dirty = true; soon(50); }).observe(root, { attributes: true, attributeFilter: ['data-net19-mode', 'data-net19-flip', 'class'] });
    for (const type of ['pointerover', 'focusin', 'click', 'keyup']) addEventListener(type, () => soon(), { capture: true, passive: true });
    // Colors chosen mid-animation (a ribbon fading from blue to white) are checked again when it ends.
    for (const type of ['transitionend', 'animationend']) addEventListener(type, () => { dirty = true; soon(200); }, { capture: true, passive: true });
    addEventListener('scroll', () => { dirty = true; soon(300); }, { capture: true, passive: true });
    addEventListener('load', () => { dirty = true; soon(100); }, { once: true });
    soon(100);
  };
  // Starts as soon as <body> exists, so labels hidden here are never painted.
  if (document.body) start();
  else new MutationObserver((_, observer) => { if (document.body) { observer.disconnect(); start(); } })
    .observe(root || document, { childList: true, subtree: true });
})();
