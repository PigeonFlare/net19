globalThis.net19Theme = { later: /^(?:set preferred source|bbc verify|bbc indepth)$/i };
(() => {
  const mark = () => {
    const news = /^\/news(\/|$)/.test(location.pathname);
    const root = document.documentElement;
    if (!root) return;
    if (news && root.getAttribute('data-net19-section') !== 'news') root.setAttribute('data-net19-section', 'news');
    else if (!news && root.hasAttribute('data-net19-section')) root.removeAttribute('data-net19-section');
  };
  if (document.documentElement) mark(); else document.addEventListener('readystatechange', mark, { once: true });
  addEventListener('popstate', mark);
  let last = location.pathname;
  setInterval(() => { if (location.pathname !== last) { last = location.pathname; mark(); } }, 1000);
})();
