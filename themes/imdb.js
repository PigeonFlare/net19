globalThis.net19Theme = {
  detect: () => (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  watch: [],
  intended: '[data-testid*="reaction"], [data-testid^="watched-button"], section.ipc-page-section:has([data-testid="bar-chart"]), section[data-testid="RelatedInterests"], .ipc-page-grid:has(> [data-testid="exploreStreaming_title"]), [data-n19-interest], [data-n19-later], section.ipc-page-section:has(.ipc-slate a[href*="/interest/"]), [data-testid="find-results-section-interest"]',
};
(() => {
  const GENRES = /^(Action|Adventure|Animation|Biography|Comedy|Crime|Documentary|Drama|Family|Fantasy|Film-Noir|Game-Show|History|Horror|Music|Musical|Mystery|News|Reality-TV|Romance|Sci-Fi|Short|Sport|Talk-Show|Thriller|War|Western)$/;
  const mark = () => {
    for (const el of document.querySelectorAll('[data-testid="hero-parent"] :is(a, button)')) {
      if (!el.hasAttribute('data-n19-later') && /^Set your preferred services$/i.test(el.textContent.trim())) el.setAttribute('data-n19-later', '');
    }
    for (const chip of document.querySelectorAll('[data-testid="interests"] a.ipc-chip')) {
      const later = !GENRES.test(chip.textContent.trim());
      if (chip.hasAttribute('data-n19-interest') !== later) chip.toggleAttribute('data-n19-interest', later);
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; mark(); }); };
  const start = () => { mark(); new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-n19-interest'] }); addEventListener('load', later); };
  start();
})();
