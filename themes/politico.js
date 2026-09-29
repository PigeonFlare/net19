globalThis.net19Theme = {
  detect: () => 'light',
  later: /^(?:add politico on google.*|listen to this article|listen|gift this article|share this article with ai|politico pro upgrade|more from politico)$/i,
  keepLabels: /^(?:search|pro|magazine)$/i,
  intended: '.homepageNav, .articleNav, header#js-top-header .actions-lineup__item:has(> a:is([href*="politico.eu"], [href*="eenews.net"]))',
};
