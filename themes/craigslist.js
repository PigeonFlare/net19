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
  const later = net19.frame(fix);
  const start = () => { fix(); new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true, characterData: true }); };
  start();
})();
