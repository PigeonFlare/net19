// net19 handmade theme: TechCrunch, 2019. TechCrunch has a single (light) design, so the default background-luminance
// detection keeps it light and the engine inverts the page on dark devices. The 2024 palette (a darker green, a
// near-black, a purple for promotions) is pointed back at 2019's greens and plain black.
globalThis.net19Theme = {
  light: {
    '#0a8935': '#00a562', '#0aa43e': '#0a9e01', '#212623': '#000000', '#151a17': '#000000', '#2c312e': '#333333', '#edf1ef': '#f1f1f1',
    '#d2dcd7': '#dddddd', '#b5c0bc': '#999999', '#6c7571': '#777777', '#535554': '#555555', '#5631ea': '#00a562', '#68f176': '#00d301',
  },
  // "Headlines only" view switch (2023) and the StrictlyVC / ticket promotions.
  later: /^(?:headlines only|get your ticket|get tickets|buy tickets|25% off tickets now)$/i,
};
// In the 2019 left rail the small TC mark is the site's only logo (techcrunch.css shows it and hides the 2024 lockup),
// but on the home page TechCrunch marks it inert and aria-hidden, so it can't be clicked or reached. It is released
// while the rail is shown.
(() => {
  const RAIL = matchMedia('(min-width: 64em)');
  const LOGO = '.wp-block-techcrunch-site-header__logo-small';
  const fix = () => {
    if (!RAIL.matches) return;
    for (const logo of document.querySelectorAll(`${LOGO}[inert], ${LOGO}[aria-hidden="true"]`)) { logo.removeAttribute('inert'); logo.removeAttribute('aria-hidden'); }
  };
  const start = () => { fix(); new MutationObserver(fix).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['inert', 'aria-hidden'] }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
