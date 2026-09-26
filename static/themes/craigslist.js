// net19 handmade theme: craigslist, 2019. craigslist has no dark mode; default detection keeps it light.
globalThis.net19Theme = {};
// 2019 result rows showed the posting date ("Sep 26"); the 2022 search app shows relative times ("7m ago"). The full date
// is kept in the span's title, so the short date is written back from it.
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
  start();  // from document_start: the header is fixed as soon as it is parsed, without waiting for DOMContentLoaded
})();
