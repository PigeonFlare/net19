globalThis.net19Theme = {
  detect: () => 'light',
  later: /^(?:add politico on google.*|listen to this article|listen|gift this article|share this article with ai|politico pro upgrade|more from politico)$/i,
  keepLabels: /^(?:search|pro|magazine)$/i,
  intended: '.homepageNav, .articleNav, header#js-top-header .actions-lineup__item:has(> a:is([href*="politico.eu"], [href*="eenews.net"]))',
};
(() => {
  const addMagazine = () => {
    const pro = document.querySelector('header#js-top-header .actions-lineup__item > a[href*="politicopro.com"]');
    if (!pro || pro.closest('.actions-lineup__list').querySelector('[data-n19-magazine]')) return;
    const item = pro.parentElement.cloneNode(true);
    item.setAttribute('data-n19-magazine', '');
    const link = item.querySelector('a');
    link.href = 'https://www.politico.com/magazine/'; link.removeAttribute('target'); link.removeAttribute('data-tracking'); link.textContent = 'Magazine';
    pro.parentElement.before(item);
  };
  const start = () => { addMagazine(); new MutationObserver(addMagazine).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
