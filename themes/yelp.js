globalThis.net19Theme = {};
(() => {
  const mark = () => document.documentElement.toggleAttribute('data-n19-home', location.pathname === '/');
  mark();
  for (const type of ['popstate', 'load']) addEventListener(type, mark);
})();
(() => {
  const root = document.documentElement;
  const keep = el => { if (el && !el.hasAttribute('data-net19-keep')) { el.removeAttribute('data-net19-scrim'); el.setAttribute('data-net19-keep', ''); } };
  const mark = () => {
    if (!root.hasAttribute('data-net19-flip') || !root.hasAttribute('data-n19-home')) return;
    keep(document.querySelector('section[class*="hero__"]'));
    keep(document.querySelector('header[class*="consumer-header-container"]'));
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
