globalThis.net19Theme = {
  detect: () => document.body?.classList.contains('dark-mode') ? 'dark' : 'light',
  watch: ['class'],
};
(() => {
  const root = document.documentElement;
  const SEL = '.cmp-hero-card:has(.cmp-hero-card__media-fullBleed), .cmp-teaser:has(.cmp-teaser__image--overlay)';
  const mark = () => {
    if (!root.hasAttribute('data-net19-flip')) return;
    for (const el of document.querySelectorAll(SEL)) if (!el.hasAttribute('data-net19-keep')) { el.removeAttribute('data-net19-scrim'); el.setAttribute('data-net19-keep', ''); }
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
