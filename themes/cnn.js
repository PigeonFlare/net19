globalThis.net19Theme = {
  later: /^(?:listen|cnn audio|download the cnn app|subscribe to stream|games|streaming now)$/i,
  intended: '.container_vertical-shelf-carousel, .product-zone, [data-net19-promo]',
};
(() => {
  const fix = () => {
    for (const title of document.querySelectorAll('.product-zone--t-dark .product-zone__title')) {
      if (/^\s*Subscribe to stream/i.test(title.textContent || '')) title.closest('.product-zone')?.setAttribute('data-net19-promo', '');
    }
    for (const label of document.querySelectorAll('.container__text-label:not([data-net19-hidden]), .headline__kicker:not([data-net19-hidden])')) {
      if (/^\s*For Subscribers\s*$/i.test(label.textContent || '')) label.setAttribute('data-net19-hidden', '');
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
