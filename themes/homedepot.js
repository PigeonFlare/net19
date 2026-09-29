globalThis.net19Theme = { later: /^View Similar$/ };
(() => {
  const WORDS = [['[data-testid="header-button-Account"] p', /^(Log In|Account)$/, 'My Account']];
  const fix = () => {
    for (const [selector, from, to] of WORDS) {
      const el = document.querySelector(selector);
      const text = el?.firstChild;
      if (text?.nodeType === 3 && from.test(text.data.trim())) text.data = to;
    }
    for (const input of document.querySelectorAll('form#header-search input')) if (input.placeholder && input.placeholder !== 'What can we help you find today?') input.placeholder = 'What can we help you find today?';
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true }); };
  if (document.body) start(); else new MutationObserver((_, o) => { if (document.body) { o.disconnect(); start(); } }).observe(document.documentElement, { childList: true });
})();
