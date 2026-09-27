globalThis.net19Theme = {
  later: /^(?:gift article|save this article|listen to this article|tour|get the app|get the business insider app)$/i,
  keepLabels: /^(?:read)$/i,
};
(() => {
  const fix = () => {
    for (const el of document.querySelectorAll('.trending-bar span, .trending-bar div, .trending-bar em, .trending-bar strong')) {
      if (el.childElementCount === 0 && /^\s*(new|sign up)\s*$/i.test(el.textContent || '')) el.setAttribute('data-net19-hidden', '');
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
