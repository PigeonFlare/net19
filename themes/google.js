globalThis.net19Theme = {
  keep: '.Ygr1Ue, .OeV5lf',
  detect() {
    const probe = getComputedStyle(document.documentElement).getPropertyValue('--yTtsEf').trim().toLowerCase();
    if (probe === '#c4eed0') return 'dark';
    if (probe === '#072711') return 'light';
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },
};
(() => {
  const OVERVIEW = /^(?:AI Overview|AI Mode reply for\b.*|AI Mode response\b.*)$/;
  const hide = () => {
    const anchors = [...document.querySelectorAll('[data-subtree="aimc"]'),
      ...[...document.querySelectorAll('h1, h2, div[role="heading"], strong')].filter(h => OVERVIEW.test(h.textContent.replace(/\s+/g, ' ').trim()))];
    for (const anchor of anchors) {
      if (anchor.closest('[data-net19-hidden]')) continue;
      const result = 'a[href] h3, h3 a[href], [data-hveid] a[href] h3';
      const own = anchor.querySelectorAll(result).length;
      let block = anchor;
      const others = el => [...el.querySelectorAll(result)].some(h => !block.contains(h));
      const adds = el => (el.innerText || '').length - (block.innerText || '').length > 300;
      while (block.parentElement && block.parentElement !== document.body && !['rso', 'center_col', 'search', 'rcnt', 'main'].includes(block.parentElement.id) && !others(block.parentElement) && !adds(block.parentElement)) block = block.parentElement;
      if (!((block !== anchor || anchor.matches('[data-subtree]')) && block.querySelectorAll(result).length <= own)) continue;
      if (!block.querySelector(ANSWER_2019)) { hideBlock(block); continue; }
      pruneAround(block);
      for (let up = block, depth = 0; up && up.id !== 'rcnt' && depth < 16; up = up.parentElement, depth++) up.setAttribute('data-n19-unclamp', '');
    }
    for (const block of document.querySelectorAll('[data-net19-ai]')) {
      let shell = block.parentElement;
      while (shell && shell !== document.body && !STOP.includes(shell.id) && !shell.querySelector(RESULT) && (shell.innerText || '').trim().length <= 40) {
        hideBlock(shell);
        shell = shell.parentElement;
      }
    }
  };
  const STOP = ['rso', 'center_col', 'search', 'rcnt', 'main'];
  const ANSWER_2019 = '#wob_wc, .pWvJNd article, article.NklNX';
  const pruneAround = block => {
    for (const child of block.children) {
      if (child.matches(ANSWER_2019) || child.matches('script, style')) continue;
      if (!child.querySelector(ANSWER_2019)) { hideBlock(child); continue; }
      child.setAttribute('data-n19-unclamp', '');
      pruneAround(child);
    }
  };
  const RESULT = 'a[href] h3, h3 a[href]';
  const hideBlock = el => { el.setAttribute('data-net19-hidden', ''); el.setAttribute('data-net19-ai', ''); el.style.setProperty('display', 'none', 'important'); };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; hide(); }); };
  const start = () => { hide(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
(() => {
  const LUCKY = /^i['’]?m feeling lucky$/i;
  const mark = () => {
    for (const el of document.querySelectorAll('a, button, [role="button"], [role="link"]')) {
      if (el.hasAttribute('data-net19-lucky') || el.closest('#rso, #search')) continue;
      const text = (el.textContent || '').replace(/\s+/g, ' ').replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '').trim();
      if (LUCKY.test(text)) el.setAttribute('data-net19-lucky', '');
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; mark(); }); };
  const start = () => { mark(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
(() => {
  const home = () => /^\/(?:webhp)?$/.test(location.pathname) && !document.getElementById('rso');
  const shown = el => !!el && (el.checkVisibility ? el.checkVisibility({ checkVisibilityCSS: true }) : el.getClientRects().length > 0);
  const PROMO = /^(?:build, create,? and do more with ai\b.*|.*\bai tools from google\b.*|try ai mode\b.*|meet gemini\b.*|.*\bnew\b.*\bai mode\b.*)$/i;
  const logo = () => {
    const field = document.querySelector('form[role="search"] textarea[name="q"], form[role="search"] input[name="q"]');
    let slot = document.getElementById('sI1XGe') || document.querySelector('.sI1XGe');
    if (!slot && field) {
      const top = field.getBoundingClientRect().top;
      for (let e = field.closest('form'); e && e !== document.body && !slot; e = e.parentElement) {
        const prev = e.previousElementSibling;
        if (prev && prev.querySelector('img, svg, canvas') && prev.getBoundingClientRect().bottom <= top + 4 && prev.getBoundingClientRect().height > 40) slot = prev;
      }
    }
    if (!slot || slot.hasAttribute('data-net19-logo')) return;
    const svg = [...slot.querySelectorAll('svg[viewBox="0 0 272 92"]')].find(shown);
    if (!svg || svg.getBoundingClientRect().width < 200) slot.setAttribute('data-net19-logo', '');
  };
  const buttons = () => {
    const lucky = [...document.querySelectorAll('[data-net19-lucky]')].find(shown);
    if (!lucky || [...document.querySelectorAll('input[name="btnK"]')].some(shown) || document.querySelector('[data-net19-gsearch]')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('data-net19-gsearch', '');
    button.textContent = 'Google Search';
    button.addEventListener('click', event => {
      event.preventDefault();
      const q = (document.querySelector('form[role="search"] textarea[name="q"], form[role="search"] input[name="q"]')?.value || '').trim();
      if (q) location.assign('/search?q=' + encodeURIComponent(q));
    });
    lucky.before(button);
  };
  const promos = () => {
    for (const el of document.querySelectorAll('a, span, div, p')) {
      if (el.children.length > 4 || el.closest('[data-net19-hidden], form, #rso, #search')) continue;
      const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (text.length > 160 || !PROMO.test(text)) continue;
      let block = el;
      while (block.parentElement && block.parentElement !== document.body && (block.parentElement.textContent || '').replace(/\s+/g, ' ').trim().length <= text.length + 30
        && !block.parentElement.querySelector('form, input, textarea')) block = block.parentElement;
      block.setAttribute('data-net19-hidden', '');
    }
  };
  const run = () => { if (!home()) return; logo(); buttons(); promos(); };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; run(); }); };
  const start = () => { run(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
(() => {
  const leaveAiMode = () => {
    if (location.pathname !== '/search') return;
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (params.get('udm') !== '50' || !query) return;
    const plain = new URLSearchParams({ q: query });
    for (const key of ['hl', 'gl', 'safe']) if (params.get(key)) plain.set(key, params.get(key));
    location.replace('/search?' + plain);
  };
  leaveAiMode();
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; leaveAiMode(); }); };
  new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true });
  addEventListener('popstate', leaveAiMode);
})();
(() => {
  const LATER_MODULES = /^(?:what people are saying|discussions and forums|short videos|things to know|perspectives|ask anything in ai mode|from sources across the web|people also ask|others (?:also )?ask|related questions|common questions|questions & answers|dive deeper(?: in ai mode)?|explore more in ai mode)$/i;
  const LATER_BUTTONS = /^(?:customize|preferred sources|dive deeper in ai mode|ai mode|show more ai answers|read more)$/i;
  const STOP = ['rso', 'center_col', 'search', 'rcnt', 'main', 'botstuff', 'bres', 'rhs'];
  const WEB_RESULT = 'a[href] h3.LC20lb, a.zReHs h3';
  const QUESTION = '.related-question-pair, [jscontroller][data-q][data-lk], [data-initq]';
  const text = el => (el.textContent || '').replace(/\s+/g, ' ').trim();
  const hide = el => { el.setAttribute('data-net19-hidden', ''); el.style.setProperty('display', 'none', 'important'); };
  const widen = anchor => {
    let block = anchor;
    while (block.parentElement && !STOP.includes(block.parentElement.id) && block.parentElement !== document.body) {
      const parent = block.parentElement;
      const headings = [...parent.querySelectorAll('[role="heading"][aria-level="2"], h2')].filter(h => !block.contains(h) && text(h) && !LATER_MODULES.test(text(h)));
      const results = [...parent.querySelectorAll(WEB_RESULT)].filter(h => !block.contains(h));
      if (headings.length || results.length) break;
      block = parent;
    }
    return block;
  };
  const modules = () => {
    for (const heading of document.querySelectorAll('#rcnt [role="heading"], #rcnt h2, #botstuff [role="heading"], #botstuff h2')) {
      if (heading.closest('[data-net19-hidden]') || !LATER_MODULES.test(text(heading))) continue;
      const block = widen(heading);
      if (block !== heading && !block.querySelector(WEB_RESULT)) hide(block);
    }
    for (const question of document.querySelectorAll(QUESTION)) {
      if (question.closest('[data-net19-hidden]') || question.closest('#rcnt, #botstuff') === null) continue;
      const block = widen(question);
      if (!block.querySelector(WEB_RESULT)) hide(block);
    }
    for (const button of document.querySelectorAll('#rso [role="button"], #rso button, #rso a')) {
      if (button.hasAttribute('data-net19-hidden') || button.closest('.zReHs') || !LATER_BUTTONS.test(text(button))) continue;
      if (button.closest('.MjjYud, .ULSxyf') && button.getBoundingClientRect().height <= 48 && !button.querySelector('h3')) hide(button);
    }
  };
  const alpha = color => { const m = String(color).match(/[\d.]+/g); if (!m || m.length < 3) return 0; return m.length > 3 ? +m[3] : 1; };
  const seen = new WeakSet();
  const SKIP = 'img, svg, video, canvas, g-img, picture, iframe, path, input, textarea';
  const shapes = () => {
    for (const el of document.querySelectorAll('#rcnt *, #botstuff *')) {
      if (seen.has(el)) continue;
      if (el.matches(SKIP) || el.closest('form, [data-net19-hidden]')) { seen.add(el); continue; }
      const box = el.getBoundingClientRect();
      if (!box.width || !box.height) continue;
      seen.add(el);
      const style = getComputedStyle(el);
      const filled = alpha(style.backgroundColor) >= .9 && style.backgroundImage === 'none';
      const outlined = parseFloat(style.borderTopWidth) > 0 && alpha(style.borderTopColor) > 0;
      if (!filled && !outlined) continue;
      const raw = style.borderTopLeftRadius;
      const radius = raw.endsWith('%') ? parseFloat(raw) / 100 * Math.min(box.width, box.height) : parseFloat(raw) || 0;
      if (radius < 8) continue;
      const round = box.width <= 48 && box.height <= 48 && Math.abs(box.width - box.height) <= 4 && radius >= box.width / 2 - 2;
      const pill = !round && box.height <= 48 && radius >= box.height / 2 - 2 && text(el).length > 0;
      const shape = round ? 'round' : pill ? 'pill' : radius >= 12 ? 'card' : '';
      if (shape) el.setAttribute('data-n19-shape', shape);
    }
  };
  const run = () => { if (location.pathname !== '/search') return; modules(); shapes(); };
  let timer = 0;
  const later = () => { clearTimeout(timer); timer = setTimeout(run, 200); };
  const start = () => { run(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); addEventListener('load', later, { once: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
