globalThis.net19Theme = {
  intended: '[data-testid="sub-nav-links-container"]',
  keep: 'main div.card-wrapper:has(img)',
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
    new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['placeholder'] });
  };
  net19.onBody(start);
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
