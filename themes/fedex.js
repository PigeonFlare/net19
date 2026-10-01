globalThis.net19Theme = { later: /^ask fedex$/i };
(() => {
  const fix = () => {
    for (const span of document.querySelectorAll('.fxg-global-nav .fxg-dropdown-js > .fxg-mouse')) {
      const node = span.firstChild;
      if (node?.nodeType === 3 && node.textContent.trim() === 'Design & Print') node.textContent = ' Printing Services ';
    }
  };
  const later = net19.frame(fix);
  const start = () => { fix(); new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true }); };
  start();
})();
