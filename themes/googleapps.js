(() => {
  const host = location.hostname, path = location.pathname;
  const key =
    host === 'accounts.google.com' ? 'accounts'
    : host === 'myaccount.google.com' || (/^(www\.)?google\.com$/.test(host) && path.startsWith('/account')) ? 'myaccount'
    : /^(www\.)?google\.[a-z.]+$/.test(host) && /^\/maps/.test(path) || host === 'maps.google.com' ? 'maps'
    : host === 'translate.google.com' ? 'translate'
    : host === 'photos.google.com' || path.startsWith('/photos') ? 'photos'
    : host === 'calendar.google.com' ? 'calendar'
    : host === 'meet.google.com' ? 'meet'
    : host === 'play.google.com' ? 'play'
    : host === 'shopping.google.com' || path.startsWith('/shopping') ? 'shopping'
    : path.startsWith('/finance') ? 'finance'
    : host === 'policies.google.com' ? 'policies'
    : host === 'business.google.com' ? 'business'
    : host === 'workspace.google.com' ? 'workspace'
    : host === 'support.google.com' ? 'support'
    : host === 'gemini.google.com' ? 'gemini'
    : host === 'about.google' || path.startsWith('/about') || path.startsWith('/intl/') ? 'about'
    : host === 'blog.google' ? 'blog'
    : /(^|\.)store\.google(\.com)?$/.test(host) ? 'store'
    : host === 'contacts.google.com' ? 'contacts'
    : host === 'keep.google.com' ? 'keep'
    : 'other';
  document.documentElement?.setAttribute('data-n19-g', key);
  const gemini = key === 'gemini';

  const lum = c => { const m = String(c).match(/[\d.]+/g); if (!m || (m.length > 3 && +m[3] < .5)) return null; return (.2126 * m[0] + .7152 * m[1] + .0722 * m[2]) / 255; };
  globalThis.net19Theme = {
    detect() {
      const root = document.documentElement;
      if (root.classList.contains('dark') || root.getAttribute('data-theme') === 'dark' || root.hasAttribute('dark') || document.body?.classList.contains('dark-theme')) return 'dark';
      for (const el of [document.body, root, document.querySelector('main, c-wiz, #app, [role="main"]')]) {
        if (!el) continue;
        const l = lum(getComputedStyle(el).backgroundColor);
        if (l !== null) return l < .35 ? 'dark' : 'light';
      }
      return 'light';
    },
    watch: ['class', 'dark', 'data-theme', 'style'],
    light: {
      '#0b57d0': '#1a73e8', '#0842a0': '#1967d2', '#041e49': '#174ea6', '#00639b': '#1a73e8', '#004a77': '#1967d2', '#001d35': '#174ea6',
      '#d3e3fd': '#e8f0fe', '#c2e7ff': '#e8f0fe', '#a8c7fa': '#aecbfa', '#7fcfff': '#aecbfa',
      '#f0f4f9': '#ffffff', '#f8fafd': '#ffffff', '#e9eef6': '#f1f3f4', '#dde3ea': '#f1f3f4', '#e1e3e1': '#f1f3f4', '#d3dbe5': '#e8eaed',
      '#1f1f1f': '#202124', '#444746': '#5f6368', '#747775': '#80868b', '#c4c7c5': '#dadce0', '#e3e3e3': '#dadce0',
      '#146c2e': '#188038', '#b3261e': '#d93025', '#f9dedc': '#fce8e6', '#8c1d18': '#a50e0e',
      '#007b8b': '#1a73e8', '#014f5a': '#1967d2', '#c4eed0': '#e6f4ea',
    },
    dark: {
      '#131314': '#202124', '#0e0e0e': '#202124', '#121212': '#202124', '#191919': '#202124', '#1f1f1f': '#202124', '#1b1b1b': '#202124', '#1e1f20': '#202124', '#282a2c': '#303134', '#333537': '#3c4043', '#37393b': '#3c4043',
      '#e3e3e3': '#e8eaed', '#c4c7c5': '#9aa0a6', '#8e918f': '#9aa0a6', '#444746': '#5f6368',
      '#a8c7fa': '#8ab4f8', '#7cacf8': '#8ab4f8', '#0842a0': '#394457', '#004a77': '#394457', '#062e6f': '#202124', '#d3e3fd': '#e8eaed',
      '#6dd58c': '#81c995', '#f2b8b5': '#f28b82',
    },
    later: /^(?:dive deeper with ai|ask gemini|try gemini(?: .*)?|gemini (?:in .{2,30}|advanced|app|apps|live)|open gemini|chat with gemini|get gemini(?: .*)?|help me (?:write|organi[sz]e|create|plan|visuali[sz]e)|ask maps|ask about (?:this )?(?:place|product|page)|ai overview|ai mode|ask (?:photos|play)|research|deep search|ai-powered .{2,30}|summari[sz]e (?:this )?(?:page|product|reviews?)|google ai (?:pro|ultra|plus)|try (?:ai|nano banana|veo|flow|notebooklm)|nano banana|notebooklm)$/i,
    ...(gemini ? { keepLabels: /[\s\S]/ } : {}),
  };
  if (gemini) return;

  const BUTTON = 'button, a, [role="button"], [role="link"], input[type="submit"], input[type="button"], label';
  const TEXT_INPUT = 'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="file"]), textarea, [role="combobox"], [contenteditable="true"]';
  const NAV = 'nav, aside, g-menu, [role="navigation"], [role="tablist"][aria-orientation="vertical"], [role="menu"], [role="tree"], [class*="drawer" i], [class*="sidenav" i], [class*="side-nav" i]';
  const TINTS = new Set(['240,244,249', '233,238,246', '248,250,253', '221,227,234', '225,227,225', '237,242,250', '243,246,252', '238,243,253', '234,241,251', '242,246,252', '241,244,249', '247,249,252', '232,238,247', '239,243,248']);
  const DARK_TINTS = new Set(['19,19,20', '30,31,32', '40,42,44', '27,27,27', '51,53,55', '33,34,35', '38,39,41']);
  const SELECTED = new Set(['211,227,253', '194,231,255', '211,227,252', '168,199,250', '232,240,254']);
  const SKIP = /^(SCRIPT|STYLE|LINK|META|NOSCRIPT|TEMPLATE|BR|HR|WBR|svg|SVG|path|PATH|g|G|IFRAME|SOURCE|TRACK|HTML|BODY|HEAD|TITLE|OPTION|C-DATA)$/;
  const ATTRS = ['data-n19-shape', 'data-n19-fill'];
  let seen = new WeakSet();
  const radius = (value, w, h) => value.endsWith('%') ? parseFloat(value) / 100 * Math.min(w, h) : parseFloat(value) || 0;
  const tint = rgb => { const [r, g, b] = rgb.split(',').map(Number); return Math.min(r, g, b) >= 224 && b - r >= 4 && b - r <= 24 && b >= g && rgb !== '232,240,254'; };
  const pick = rgb => { if (SELECTED.has(rgb)) return true; const [r, , b] = rgb.split(',').map(Number); return b >= 245 && r >= 150 && b - r >= 35 && b - r <= 110; };
  const rgbOf = c => { const m = String(c).match(/[\d.]+/g); return m && (m.length < 4 || +m[3] > .6) ? m.slice(0, 3).map(Math.round).join(',') : null; };
  const classify = list => {
    const out = [];
    for (const el of list) {
      if (SKIP.test(el.tagName) || el.closest('[data-net19-hidden]')) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none') continue;
      const tl = cs.borderTopLeftRadius, br = cs.borderBottomRightRadius;
      const bg = rgbOf(cs.backgroundColor);
      const selected = bg && pick(bg);
      const tinted = bg && !selected && (TINTS.has(bg) || DARK_TINTS.has(bg) || tint(bg));
      if ((tl === '0px' && br === '0px') && !tinted) continue;
      const w = el.offsetWidth, h = el.offsetHeight;
      if (!w || !h) { seen.delete(el); continue; }
      const r = Math.max(radius(tl, w, h), radius(br, w, h));
      let shape = '', fill = '';
      const pill = r >= h / 2 - 3;
      if (r >= 10 && h >= 34 && h <= 60 && w >= h * 1.4 && pill && !el.querySelector(TEXT_INPUT) &&
        (el.matches(BUTTON) || (el.querySelector(BUTTON) && (bg || parseFloat(cs.borderTopWidth) > 0) && w <= 480))) shape = 'btn';
      else if (r >= 12 && h >= 32 && h <= 76 && w >= h * 2.5 && (el.matches(TEXT_INPUT) || el.querySelector(TEXT_INPUT))) shape = 'field';
      else if (r >= 12 && selected && h >= 28 && h <= 60 && w >= h * 2.5 && el.closest(NAV)) shape = 'tab';
      else if (r >= 11 && !pill && w >= 200 && w <= 640 && h >= innerHeight - 24) shape = 'flat';
      else if (r >= 11 && !pill && w >= 120 && h >= 56) shape = 'card';
      else if (r >= 12 && /^(IMG|VIDEO|PICTURE|CANVAS)$/.test(el.tagName) && w >= 48 && h >= 48 && !pill) shape = 'card';
      if (tinted) fill = shape === 'field' || (h <= 76 && w <= 900 && !el.matches('main, header, body > *')) ? 'field' : 'page';
      else if (selected && shape === 'tab') fill = 'sel';
      if (shape || fill) out.push([el, shape, fill]);
    }
    for (const [el, shape, fill] of out) {
      if (shape) el.setAttribute('data-n19-shape', shape);
      if (fill) el.setAttribute('data-n19-fill', fill);
    }
  };
  const NOTE = /^(?:AI content may include mistakes|AI responses may include mistakes|Generative AI is experimental|AI Overview)\b/i;
  const SPARK = /^(?:search_spark|spark|gemini_spark|magic_button)$/;
  const texts = root => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const hide = [], swap = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const t = n.nodeValue.trim();
      if (t.length < 5 || t.length > 90) continue;
      const el = n.parentElement;
      if (!el || el.closest('[data-net19-hidden], script, style')) continue;
      if (SPARK.test(t) && el.matches('i, .notranslate, [class*="symbol" i], [class*="icon" i]')) swap.push(el);
      else if (NOTE.test(t) && !el.closest('main article, [role="article"], p')) hide.push(el.closest('div:not(:has(> div + div)), span') || el);
    }
    for (const el of swap) el.textContent = 'search';
    for (const el of hide) if (!el.querySelector('input, textarea, [contenteditable]')) el.setAttribute('data-net19-hidden', '');
  };
  const all = root => root.querySelectorAll ? [root, ...root.querySelectorAll('*')] : [];
  let pending = new Set(), frame = 0;
  const flush = () => {
    frame = 0;
    const list = [];
    for (const root of pending) if (root.isConnected) for (const el of all(root)) if (!seen.has(el)) { seen.add(el); list.push(el); }
    const roots = [...pending].filter(r => r.isConnected);
    pending = new Set();
    for (const root of roots) texts(root);
    if (list.length) classify(list);
  };
  const queue = root => { pending.add(root); if (!frame) frame = requestAnimationFrame(flush); };
  const rejudge = els => {
    for (const el of els) { for (const a of ATTRS) el.removeAttribute(a); seen.delete(el); }
    classify(els.filter(el => el.isConnected).map(el => (seen.add(el), el)));
  };
  const full = () => { seen = new WeakSet(); queue(document.body); };
  const start = () => {
    queue(document.body);
    new MutationObserver(records => {
      const again = [];
      for (const r of records) {
        if (r.type === 'childList') { for (const n of r.addedNodes) if (n.nodeType === 1) queue(n); }
        else if (r.target.nodeType === 1 && r.target !== document.body) again.push(r.target);
      }
      if (again.length) requestAnimationFrame(() => rejudge([...new Set(again)]));
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-selected', 'aria-current', 'aria-expanded', 'open', 'data-selected'] });
    let sheetTimer = 0;
    const sheets = () => { clearTimeout(sheetTimer); sheetTimer = setTimeout(full, 60); };
    addEventListener('load', e => { if (e.target instanceof HTMLLinkElement || e.target === window || e.target === document) sheets(); }, true);
    document.addEventListener('DOMContentLoaded', sheets, { once: true });
    addEventListener('load', () => setTimeout(full, 2000), { once: true });
    for (const type of ['click', 'keyup']) addEventListener(type, () => setTimeout(() => queue(document.body), 400), { capture: true, passive: true });
  };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
