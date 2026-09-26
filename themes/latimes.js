// net19 handmade theme: Los Angeles Times, 2019. The Times has a single (light) design, so the default
// background-luminance detection keeps it light and the engine inverts the page on dark devices.
globalThis.net19Theme = {
  // Like buttons and "Listen to this content" (2023-24), the Live Stream link.
  later: /^(?:like this content|listen to this content|click here to listen to this article|live stream)$/i,
};
// "For subscribers" flags over promos (the 2020s paywall) have no class of their own: they are found by their text.
(() => {
  const fix = root => {
    for (const el of (root.querySelectorAll ? root : document).querySelectorAll('.promo *, .promo-category')) {
      if (el.childElementCount > 2 || el.hasAttribute('data-net19-hidden')) continue;
      if (/^\s*for subscribers\s*$/i.test(el.textContent || '')) (el.closest('.promo-category, .promo-label') || el).setAttribute('data-net19-hidden', '');
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(document); }); };
  const start = () => { fix(document); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
