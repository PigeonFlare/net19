globalThis.net19Theme = {
  later: /^(?:like this content|listen to this content|click here to listen to this article|live stream)$/i,
};
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
