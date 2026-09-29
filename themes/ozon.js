globalThis.net19Theme = {
  later: /^(?:ai-ассистент|ai ассистент|ассистент|ии-помощник|ии помощник|спросить ии|коротко о товаре|ии-ответ)$/i,
};
(() => {
  const mark = () => {
    const header = document.querySelector('[data-widget="header"]');
    if (!header) return;
    const home = header.querySelector('a[href="/"] img, a[href="https://www.ozon.ru/"] img');
    if (home) { if (!home.hasAttribute('data-n19-oz')) home.setAttribute('data-n19-oz', 'logo'); return; }
    if (header.querySelector('img[data-n19-oz]')) return;
    for (const img of header.querySelectorAll('img')) {
      if (img.closest('[data-widget]') !== header) continue;
      const catalog = header.querySelector('[data-widget="catalogMenu"]');
      if (catalog && img.getBoundingClientRect().right > catalog.getBoundingClientRect().left + 1) continue;
      img.setAttribute('data-n19-oz', 'logo');
      break;
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; mark(); }); };
  const start = () => { mark(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else new MutationObserver((_, o) => { if (document.body) { o.disconnect(); start(); } }).observe(document.documentElement, { childList: true });
})();
