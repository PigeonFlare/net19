globalThis.net19Theme = {
  intended: '#navigation .language-onboarding-container, #navigation button.category-tab-wrapper, #navigation a.section-item[href^="/flas-indirimler"], footer .footer-custom-section, footer a.footer-bar-social-media-item[href*="tiktok.com"]',
  later: /^(?:trendyol asistan|asistan|ai asistan|alışveriş asistanı|asistana sor|yapay zeka asistanı|ai ile özetle|ai özet|yorum özeti|yapay zeka yorum özeti)$/i,
};
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
  net19.watch(fix, { childList: true, subtree: true, attributes: true, attributeFilter: ['placeholder'] });
})();
