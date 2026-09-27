globalThis.net19Theme = { later: /^(?:ask learn|summarize this article(?: for me)?|ask copilot|try copilot(?: free)?|get copilot|copilot(?: pro| app)?|microsoft 365 copilot(?: app)?)$/i };
(() => {
  const root = document.documentElement;
  const SEL = 'store-hero-featured-xl-video, store-hero-featured-slider-item';
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
