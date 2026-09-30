globalThis.net19Theme = {
  intended: '[data-n19-post2019]',
  later: /^(?:cruises|attractions|customer support|add flights|safety resource center|genius rewards visa®?|genius loyalty program|traveller review awards|discover monthly stays|all flight destinations|all car rental locations|all vacation destinations|guides|discover|seasonal and holiday deals|sustainability|how we work)$/i,
  light: { '#003b95': '#003580', '#006ce4': '#0071c2', '#0057b8': '#00487a', '#ffb700': '#febb02', '#1a4fa0': '#003580' },
  dark: { '#003b95': '#002a66', '#006ce4': '#4aa3ff', '#0057b8': '#1f8ce0', '#ffb700': '#febb02', '#1a4fa0': '#002a66' },
};
(() => {
  const LATER_SECTIONS = /^(?:why booking\.com\?|quick and easy trip planner|save more with weekend deals|deals for the weekend|looking for a [a-z ]+ trip\?|survey with \d+ questions)$/i;
  const markSections = () => {
    for (const region of document.querySelectorAll('[role="region"][aria-label]')) {
      if (LATER_SECTIONS.test(globalThis.net19English(region.getAttribute('aria-label').trim())) && !region.hasAttribute('data-n19-post2019')) region.setAttribute('data-n19-post2019', '');
    }
    for (const heading of document.querySelectorAll('main h2, h2[data-testid="webcore-carousel-heading"]')) {
      if (!LATER_SECTIONS.test(globalThis.net19English(heading.textContent.trim()))) continue;
      const section = heading.closest('[data-testid="usp-container"], .trip-types-carousel-more-workaround') || heading.parentElement?.parentElement?.parentElement;
      if (section && !section.hasAttribute('data-n19-post2019')) section.setAttribute('data-n19-post2019', '');
    }
  };
  const markFlightAddOn = () => {
    const box = document.querySelector('input[name="sb_flight_search"]');
    const label = box?.id && document.querySelector(`label[for="${CSS.escape(box.id)}"]`);
    let row = box?.parentElement;
    while (row && label && !row.contains(label)) row = row.parentElement;
    if (row && !row.querySelector('input[name="sb_travel_purpose"]') && !row.hasAttribute('data-n19-post2019')) row.setAttribute('data-n19-post2019', '');
  };
  const markFilledButtons = () => {
    for (const cta of document.querySelectorAll('[data-testid="promotional-banner-content-cta"]:not([data-n19-filled])')) {
      const fill = getComputedStyle(cta, '::before');
      const parts = fill.backgroundColor.match(/[\d.]+/g) || [];
      const alpha = parts.length === 4 ? +parts[3] : parts.length === 3 ? 1 : 0;
      if (fill.content !== 'none' && alpha >= .5) cta.setAttribute('data-n19-filled', '');
    }
  };
  const fix = () => {
    markSections();
    markFilledButtons();
    markFlightAddOn();
    const input = document.querySelector('input[name="ss"], #searchbox-horizontal-destination-input');
    if (input && input.placeholder !== 'Where are you going?') input.placeholder = 'Where are you going?';
  };
  net19.watch(fix, { childList: true, subtree: true, attributes: true, attributeFilter: ['placeholder'] });
})();
