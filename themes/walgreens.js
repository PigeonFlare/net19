globalThis.net19Theme = {
  later: /^(myWalgreens®?|Program Membership|myWalgreens® Credit Card|Pay myWalgreens® Credit Card Bill|Walgreens Advertising Group|Walgreens Clinical Trials|Emergency Preparedness|Impact)$/,
  intended: '#menu-holiday-quick-link, #at_close_alert, div#grid-hide:has(a[id^="health-pills-tile"]), #menu-financial-services, #menu-immunizations, #menu-language-switcher, [id^="vaccinations-tile"]',
};
(() => {
  const fix = () => {
    for (const input of document.querySelectorAll('.nav__top-container form input')) if (input.placeholder !== 'Search by keyword or item #') input.placeholder = 'Search by keyword or item #';
  };
  net19.watch(fix);
})();
