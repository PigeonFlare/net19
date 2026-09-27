globalThis.net19Theme = {
  light: {
    '#0a8935': '#00a562', '#0aa43e': '#0a9e01', '#212623': '#000000', '#151a17': '#000000', '#2c312e': '#333333', '#edf1ef': '#f1f1f1',
    '#d2dcd7': '#dddddd', '#b5c0bc': '#999999', '#6c7571': '#777777', '#535554': '#555555', '#5631ea': '#00a562', '#68f176': '#00d301',
  },
  later: /^(?:headlines only|get your ticket|get tickets|buy tickets|25% off tickets now)$/i,
};
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
