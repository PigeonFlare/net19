globalThis.net19Theme = {};
(() => {
  const mark = () => document.documentElement.toggleAttribute('data-net19-home', location.pathname === '/');
  mark();
  addEventListener('popstate', mark);
  let last = location.pathname;
  const check = () => { if (location.pathname !== last) { last = location.pathname; mark(); } };
  const start = () => new MutationObserver(() => requestAnimationFrame(check)).observe(document.body, { childList: true });
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
