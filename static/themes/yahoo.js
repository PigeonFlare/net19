// net19 handmade theme: Yahoo homepage, 2019, light and dark. Yahoo marks dark mode with html.uds-color-mode-dark.
globalThis.net19Theme = {
  detect: () => document.documentElement.classList.contains('uds-color-mode-dark') ? 'dark' : 'light',
  watch: ['class'],
  // Later additions, hidden by label: the floating "Return to Homepage" button, Yahoo's AI answers, "Follow" buttons
  later: /^(?:return to homepage|add us on google|add yahoo on google|powered by yahoo scout|alphaspace|get finance plus|get fantasy plus|try fantasy plus|try finance plus|ask yahoo|yahoo scout|ai answer|ai summary|get the yahoo app|download the yahoo app)$/i,
};
// 2019 wording: the search field had no placeholder, and the list in the right rail was titled "Trending Now".
(() => {
  const fix = () => {
    const field = document.getElementById('uh-sbq');
    if (field && field.placeholder) field.placeholder = '';
    const title = document.querySelector('#trending-search header h2');
    if (title && title.textContent === 'Trending') title.textContent = 'Trending Now';
    // Search results: the right-rail "Explore AI results with Yahoo Scout" box (2025) has no stable class of its own
    for (const box of document.querySelectorAll('body#ysch #right ol:not([data-net19-scout])')) {
      if (/Yahoo Scout/.test(box.textContent || '')) box.setAttribute('data-net19-scout', '');
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
