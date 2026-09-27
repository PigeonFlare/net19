globalThis.net19Theme = { later: /^(?:try chatgpt|download chatgpt|start now on chatgpt|ask chatgpt)$/i };
(() => {
  const root = document.documentElement;
  const fix = () => {
    const home = location.pathname === '/' || /^\/[a-z]{2}(-[A-Z]{2})?\/?$/.test(location.pathname);
    root.toggleAttribute('data-net19-home', home);
    if (!home) return;
    const article = document.querySelector('main#main > article');
    if (!article) return;
    const first = article.firstElementChild;
    if (first && first.querySelector('textarea') && !first.hasAttribute('data-net19-hidden')) first.setAttribute('data-net19-hidden', '');
    const cover = first?.hasAttribute('data-net19-hidden') ? first.nextElementSibling : null;
    if (cover && !cover.hasAttribute('data-net19-cover')) cover.setAttribute('data-net19-cover', '');
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
