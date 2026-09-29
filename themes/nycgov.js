globalThis.net19Theme = {
  intended: '[data-n19-later]',
  later: /^(?:website feedback|about nyc\.gov content|image credits)$/i,
};
(() => {
  const fix = () => {
    for (const h of document.querySelectorAll('h1')) if (h.textContent.replace(/\s+/g, ' ').trim() === 'Find what you need on nyc.gov' && !h.hasAttribute('data-n19-later')) h.setAttribute('data-n19-later', '');
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
