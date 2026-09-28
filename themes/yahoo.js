globalThis.net19Theme = {
  detect: () => {
    const root = document.documentElement;
    if (root.classList.contains('uds-color-mode-dark')) return 'dark';
    const scheme = root.getAttribute('data-color-scheme') || root.getAttribute('theme');
    if (scheme === 'dark' || scheme === 'light') return scheme;
    return scheme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },
  watch: ['class', 'theme', 'data-color-scheme'],
  later: /^(?:return to homepage|add us on google|add yahoo on google|powered by yahoo scout|alphaspace|get finance plus|get fantasy plus|try fantasy plus|try finance plus|ask yahoo|yahoo scout|ai answer|ai summary|get the yahoo app|download the yahoo app)$/i,
};
(() => {
  if (location.hostname === 'finance.yahoo.com') document.documentElement.setAttribute('data-n19-yf', '');
  const hideAskAI = () => {
    for (const el of document.querySelectorAll('[data-testid="dock"] :is(button, [role="tab"], [role="radio"], label, a)')) {
      if ((el.textContent || '').trim() !== 'Ask AI' || el.closest('[data-n19-yf-hide]')) continue;
      const group = el.closest('[role="tablist"], [role="radiogroup"]') || el.parentElement;
      group.setAttribute('data-n19-yf-hide', '');
    }
  };
  const fix = () => {
    if (location.hostname === 'finance.yahoo.com') hideAskAI();
    const field = document.getElementById('uh-sbq');
    if (field && field.placeholder) field.placeholder = '';
    const title = document.querySelector('#trending-search header h2');
    if (title && title.textContent === 'Trending') title.textContent = 'Trending Now';
    for (const box of document.querySelectorAll('body#ysch #right ol:not([data-net19-scout])')) {
      if (/Yahoo Scout/.test(box.textContent || '')) box.setAttribute('data-net19-scout', '');
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
