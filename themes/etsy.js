globalThis.net19Theme = {
  scopes: ['body'],
  intended: '#desktop-category-topnav [data-ui="top-nav-category-list"] > li:not(:has(a[href*="/hub/gifts"], a[href*="vintage"], a[href*="/giftcards"])), .chrome-footer__heading, [data-appears-component-name="sort-reviews-menu"], [data-ui="sort-reviews-menu"], #sort-reviews-menu',
  light: { '#faf8f5': '#ffffff', '#312b36': '#222222', '#534d4c': '#444444' },
  dark: {},
};
(() => {
  const fix = () => {
    const input = document.getElementById('global-enhancements-search-query');
    if (input && globalThis.net19Lang?.() === 'en' && input.placeholder !== 'Search for items or shops') input.placeholder = 'Search for items or shops';
  };
  net19.watch(fix, { childList: true, subtree: true, attributes: true, attributeFilter: ['placeholder'] });
})();
