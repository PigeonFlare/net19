// net19 handmade theme: Trendyol, 2019. Trendyol has no dark mode; palette.js flips the page on a dark device.
globalThis.net19Theme = {
  // The AI shopping assistant and AI review summaries (2024) did not exist in 2019.
  later: /^(?:trendyol asistan|asistan|ai asistan|alışveriş asistanı|asistana sor|yapay zeka asistanı|ai ile özetle|ai özet|yorum özeti|yapay zeka yorum özeti)$/i,
};
// The 2019 search field said "Aradığınız ürün veya markayı yazınız" (today: "Ürün, kategori veya marka ara").
(() => {
  const OLD = 'Aradığınız ürün veya markayı yazınız', NOW = /^Ürün, kategori veya marka ara$/;
  const fix = () => {
    const nav = document.getElementById('navigation');
    if (!nav) return;
    for (const input of nav.querySelectorAll('input[placeholder]')) if (NOW.test(input.placeholder)) input.placeholder = OLD;
    for (const span of nav.querySelectorAll('button.suggestion-placeholder > span:not(.search-icon-svg)')) {
      if (!span.children.length && NOW.test(span.textContent.trim())) span.textContent = OLD;
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['placeholder'] }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
