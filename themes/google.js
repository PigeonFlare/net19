// net19 handmade theme: Google Search, 2019. Palette tokens live in google.css (mapped onto Google's own
// variables by name). Google renders its light/dark palette server-side and may differ from the device setting,
// so the mode is read from one of Google's variables that the theme leaves untouched.
globalThis.net19Theme = {
  detect() {
    const probe = getComputedStyle(document.documentElement).getPropertyValue('--yTtsEf').trim().toLowerCase();
    if (probe === '#c4eed0') return 'dark';
    if (probe === '#072711') return 'light';
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },
};
// "AI Overview" and the inline "AI Mode" answer (2025) did not exist in 2019. They have no stable id; each is found by its
// heading, or by the AI answer's own subtree marker, and hidden as the largest block that holds it and nothing else.
(() => {
  const OVERVIEW = /^(?:AI Overview|AI Mode reply for\b.*|AI Mode response\b.*)$/;
  const hide = () => {
    const anchors = [...document.querySelectorAll('[data-subtree="aimc"]'),
      ...[...document.querySelectorAll('h1, h2, div[role="heading"], strong')].filter(h => OVERVIEW.test(h.textContent.replace(/\s+/g, ' ').trim()))];
    for (const anchor of anchors) {
      if (anchor.closest('[data-net19-hidden]')) continue;
      // Climb to the largest block that holds the answer and nothing else: stop below any ancestor that also holds a
      // search result (a linked heading) outside it. Without this, a query whose overview shares a wrapper with the web
      // results ("twitter in 2019") lost the whole first page. The answer's own source cards count as part of it.
      const result = 'a[href] h3, h3 a[href], [data-hveid] a[href] h3';
      const own = anchor.querySelectorAll(result).length;
      let block = anchor;
      const others = el => [...el.querySelectorAll(result)].some(h => !block.contains(h));
      // Only wrappers that add little beyond the answer ("Show more", a feedback line) are climbed into: a wrapper that
      // also holds another section (People also ask, videos) adds a lot of text of its own.
      const adds = el => (el.innerText || '').length - (block.innerText || '').length > 300;
      while (block.parentElement && block.parentElement !== document.body && !['rso', 'center_col', 'search', 'rcnt', 'main'].includes(block.parentElement.id) && !others(block.parentElement) && !adds(block.parentElement)) block = block.parentElement;
      if ((block !== anchor || anchor.matches('[data-subtree]')) && block.querySelectorAll(result).length <= own) { block.setAttribute('data-net19-hidden', ''); block.style.setProperty('display', 'none', 'important'); }
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; hide(); }); };
  const start = () => { hide(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
// Signed-in homepages replace the two buttons with a row of pill chips ("Create images", "Ask about files",
// "Brainstorm", "I'm feeling lucky"). guard.js hides the three AI chips; the remaining "I'm feeling lucky" chip is
// marked so google.css can draw it as the 2019 gray button. The chip has no stable class, so it is found by its text.
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
// The homepage as 2019 had it, whatever variant Google serves (signed in, doodle days, the AI Mode homepage):
// - the multicolor logo: when the logo slot holds something else (a doodle, a small signed-in mark) or a shrunken logo,
//   the slot is marked and google.css draws the 2019 logo in it;
// - both gray buttons: the signed-in variant has only an "I'm feeling lucky" chip, so a "Google Search" button is added
//   beside it (it searches for what is typed, and does nothing on an empty field, as in 2019);
// - no post-2019 promo line ("Build, create, and do more with AI tools from Google").
(() => {
  const home = () => /^\/(?:webhp)?$/.test(location.pathname) && !document.getElementById('rso');
  const shown = el => !!el && (el.checkVisibility ? el.checkVisibility({ checkVisibilityCSS: true }) : el.getClientRects().length > 0);
  const PROMO = /^(?:build, create,? and do more with ai\b.*|.*\bai tools from google\b.*|try ai mode\b.*|meet gemini\b.*|.*\bnew\b.*\bai mode\b.*)$/i;
  const logo = () => {
    const field = document.querySelector('form[role="search"] textarea[name="q"], form[role="search"] input[name="q"]');
    let slot = document.getElementById('sI1XGe') || document.querySelector('.sI1XGe');
    if (!slot && field) {
      // the block just above the search form that holds a picture
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
      // the promo's own line: climb while the parent holds nothing but it (and a "Learn more" / close control)
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
