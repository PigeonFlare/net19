globalThis.net19Theme = {};
(() => {
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fix = () => {
    for (const span of document.querySelectorAll('.cl-search-result .meta > span[title]')) {
      const d = new Date(span.title);
      if (isNaN(d)) continue;
      const text = MONTHS[d.getMonth()] + ' ' + d.getDate();
      if (span.textContent !== text) span.textContent = text;
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true, characterData: true }); };
  start();
})();
