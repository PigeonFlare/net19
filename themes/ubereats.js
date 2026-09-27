globalThis.net19Theme = {};
(() => {
  const root = document.documentElement;
  const photo = el => [el, ...el.querySelectorAll('div')].slice(0, 60).some(d => getComputedStyle(d).backgroundImage.includes('url('));
  const keep = el => { if (el && !el.hasAttribute('data-net19-keep')) { el.removeAttribute('data-net19-scrim'); el.setAttribute('data-net19-keep', ''); } };
  const mark = () => {
    if (!root.hasAttribute('data-net19-flip')) return;
    for (const h1 of document.querySelectorAll('main h1')) {
      const hero = h1.closest('main > div');
      if (!hero || hero.hasAttribute('data-net19-keep') || !photo(hero)) continue;
      keep(hero);
      const header = document.querySelector('[data-testid="header-v2-wrapper"]');
      if (header && getComputedStyle(header.parentElement).position === 'absolute') keep(header);
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
  const mark = () => {
    for (const el of document.querySelectorAll('main a, main button')) {
      if (!el.hasAttribute('data-n19-find') && /^\s*Find food\s*$/i.test(el.textContent) && !el.querySelector('img')) el.setAttribute('data-n19-find', '');
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; mark(); }); };
  const start = () => { later(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
