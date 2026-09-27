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
