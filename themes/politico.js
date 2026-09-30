globalThis.net19Theme = {
  detect: () => 'light',
  keep: 'header#js-top-header .header__branding svg, header.sticky.top-0 a[aria-label="Politico home"] svg',
  later: /^(?:add politico on google.*|listen to this article|listen|gift this article|share this article with ai|politico pro upgrade|more from politico)$/i,
  keepLabels: /^(?:search|pro|magazine)$/i,
  intended: '.homepageNav, .articleNav, header#js-top-header .actions-lineup__item:has(> a:is([href*="politico.eu"], [href*="eenews.net"]))',
};
(() => {
  const addMagazine = () => {
    const pro = document.querySelector('header#js-top-header .actions-lineup__item > a[href*="politicopro.com"]');
    const label = net19.say('Magazine');
    if (!label || !pro || pro.closest('.actions-lineup__list').querySelector('[data-n19-magazine]')) return;
    const item = pro.parentElement.cloneNode(true);
    item.setAttribute('data-n19-magazine', '');
    const link = item.querySelector('a');
    link.href = 'https://www.politico.com/magazine/'; link.removeAttribute('target'); link.removeAttribute('data-tracking'); link.textContent = label;
    pro.parentElement.before(item);
  };
  net19.watch(addMagazine);
})();
