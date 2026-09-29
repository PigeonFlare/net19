globalThis.net19Theme = { intended: '[data-n19-later]' };
(() => {
  const fix = () => {
    for (const h of document.querySelectorAll('h1, h2, h3, h4, .panel-title')) {
      if (h.textContent.replace(/\s+/g, ' ').trim().toUpperCase() !== 'ABOUT THIS FORECAST') continue;
      const box = h.closest('.panel') || h.parentElement;
      if (box && !box.hasAttribute('data-n19-later') && box.querySelectorAll('a').length <= 6) box.setAttribute('data-n19-later', '');
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
