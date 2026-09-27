globalThis.net19Theme = { later: /^ask fedex$/i };
(() => {
  const fix = () => {
    for (const span of document.querySelectorAll('.fxg-global-nav .fxg-dropdown-js > .fxg-mouse')) {
      const node = span.firstChild;
      if (node?.nodeType === 3 && node.textContent.trim() === 'Design & Print') node.textContent = ' Printing Services ';
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true }); };
  start();
})();
