globalThis.net19Theme = {
  intended: '[data-n19-later]',
  later: /^(?:website feedback|about nyc\.gov content|image credits)$/i,
};
(() => {
  const fix = () => {
    for (const h of document.querySelectorAll('h1')) if (h.textContent.replace(/\s+/g, ' ').trim() === 'Find what you need on nyc.gov' && !h.hasAttribute('data-n19-later')) h.setAttribute('data-n19-later', '');
  };
  const later = net19.watch(fix);
})();
