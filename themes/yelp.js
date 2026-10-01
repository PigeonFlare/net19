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
    if (!root.hasAttribute('data-net19-recolor') || !root.hasAttribute('data-n19-home')) return;
    keep(document.querySelector('section[class*="hero__"]'));
    keep(document.querySelector('header[class*="consumer-header-container"]'));
  };
  const later = net19.frame(mark);
  net19.onBody(() => { new MutationObserver(later).observe(root, { attributes: true, attributeFilter: ['data-net19-recolor'] }); });
  net19.watch(mark);
})();
