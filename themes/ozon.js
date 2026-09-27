// net19 handmade theme: Ozon, 2019. The header logo is marked (data-n19-oz="logo") so the stylesheet can show the
// 2019 "OZON" file (cdn1.ozone.ru, still hosted) in its place; Ozon renders the logo as an unlabeled <img>.
globalThis.net19Theme = {
  // AI review summaries and the shopping assistant (2024) did not exist in 2019.
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
      // The logo is the first image of the header row, outside every nested widget and to the left of the catalog button.
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
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
