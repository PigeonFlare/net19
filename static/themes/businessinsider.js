// net19 handmade theme: Business Insider, 2019. BI has a single (light) design, so the default background-luminance
// detection keeps it light and the engine inverts the page on dark devices.
globalThis.net19Theme = {
  // Read/Watch/Listen modes and their tour (2025), gift and save buttons (2023), audio articles, the app promotion.
  later: /^(?:gift article|save this article|listen to this article|tour|get the app|get the business insider app)$/i,
  keepLabels: /^(?:read)$/i,
};
// The trending strip marks items with small "NEW" and "Sign up" pills (2024) that have no class of their own: they
// are found by their text and hidden; the links themselves stay.
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
