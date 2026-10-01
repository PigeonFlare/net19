globalThis.net19Theme = {
  intended: '[data-n19-later]',
  later: /^(?:feedback|businesses|executive health program|international business collaborations|facilities & real estate|supplier information|health education policy|locations|mayo clinic press|instagram|linkedin|android app on google play|apple download on the app store)$/i,
  detect: () => document.body?.classList.contains('dark-mode') ? 'dark' : 'light',
  watch: ['class'],
};
(() => {
  const root = document.documentElement;
  const SEL = '.cmp-hero-card:has(.cmp-hero-card__media-fullBleed, video), .cmp-teaser:has(.cmp-teaser__image--overlay)';
  const text = el => el.textContent.replace(/\s+/g, ' ').trim();
  const hideApp = () => {
    for (const h of document.querySelectorAll('h2, h3')) if (text(h) === 'Mayo Clinic Press') { let box = h.parentElement; while (box && box.parentElement && box.parentElement.querySelectorAll('h2, h3').length === 1 && box.parentElement.tagName !== 'FORM') box = box.parentElement; if (box && !box.hasAttribute('data-n19-later')) box.setAttribute('data-n19-later', ''); }
    for (const h of document.querySelectorAll('h2, h3')) if (/^(Get the Mayo Clinic app|Businesses)$/.test(text(h))) { const box = h.closest('.aem-container'); if (box && !box.hasAttribute('data-n19-later') && box.querySelectorAll('a').length <= 6) box.setAttribute('data-n19-later', ''); }
  };
  const mark = () => {
    hideApp();
    if (!root.hasAttribute('data-net19-recolor')) return;
    for (const el of document.querySelectorAll(SEL)) if (!el.hasAttribute('data-net19-keep')) { el.removeAttribute('data-net19-scrim'); el.setAttribute('data-net19-keep', ''); }
  };
  const later = net19.frame(mark);
  net19.onBody(() => { new MutationObserver(later).observe(root, { attributes: true, attributeFilter: ['data-net19-recolor'] }); });
  net19.watch(mark);
})();
