globalThis.net19Theme = {
  intended: '[data-testid="sub-nav-links-container"]',
  later: /^(?:ask sparky|sparky|chat with sparky|try sparky|meet sparky|try walmart\+.*|join walmart\+.*|walmart\+ (?:week|deals|members)?.*|learn about spark driver|walmart business|walmart in the know.*|brand shop directory)$/i,
  light: { '#0053e2': '#0071ce', '#002e99': '#004c91' },
  dark: { '#0053e2': '#0071ce', '#002e99': '#004c91' },
};
(() => {
  const fix = () => {
    for (const input of document.querySelectorAll('header input.search-bar')) if (input.placeholder !== 'Search') input.placeholder = 'Search';
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => {
    fix();
    new MutationObserver(later).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['placeholder'] });
  };
  if (document.readyState !== 'loading') start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
(() => {
  const root = document.documentElement;
  const SEL = 'main div.card-wrapper';
  const mark = () => {
    if (!root.hasAttribute('data-net19-flip')) return;
    for (const el of document.querySelectorAll(SEL)) {
      if (el.hasAttribute('data-net19-keep') || !el.querySelector('img')) continue;
      el.removeAttribute('data-net19-scrim'); el.setAttribute('data-net19-keep', '');
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; mark(); }); };
  const start = () => {
    later();
    new MutationObserver(later).observe(document.body, { childList: true, subtree: true });
    new MutationObserver(later).observe(root, { attributes: true, attributeFilter: ['data-net19-flip'] });
  };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
(() => {
  const SOCIAL = /\bbought (?:since yesterday|in (?:the )?past)/i;
  const mark = () => {
    for (const badge of document.querySelectorAll('[data-testid="badgeTagComponent"]:not([data-net19-hidden])')) if (SOCIAL.test(badge.textContent)) badge.setAttribute('data-net19-hidden', '');
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; mark(); }); };
  new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true });
})();
