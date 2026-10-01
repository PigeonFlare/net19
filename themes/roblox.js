globalThis.net19Theme = {
  detect: () => document.body?.classList.contains('dark-theme') ? 'dark' : document.body?.classList.contains('light-theme') ? 'light' : undefined,
  keep: '.game-details-play-button-container, #left-navigation-container .left-nav nav li > :is(a, button) .icon',
  later: /^(?:roblox plus|get roblox plus|subscribe to roblox plus|charts? ai|ai assistant)$/i,
};
(() => {
  const NAMES = { Charts: 'Games', Marketplace: 'Catalog', Communities: 'Groups', Newsroom: 'Blog', 'Buy Gift Cards': 'Gift Cards' };
  const rename = el => net19.rename(el, NAMES);
  const run = () => {
    const root = document.documentElement;
    const nav = document.querySelector('#left-navigation-container .left-nav');
    const shown = !!nav && getComputedStyle(nav).visibility === 'visible' && nav.getBoundingClientRect().left >= 0;
    if (shown !== (root.getAttribute('data-n19-rbx') === 'nav')) { if (shown) root.setAttribute('data-n19-rbx', 'nav'); else root.removeAttribute('data-n19-rbx'); }
    if (globalThis.net19Lang?.() === 'en') {
      for (const link of document.querySelectorAll('#header .rbx-navbar .nav-menu-title')) rename(link);
      for (const link of nav?.querySelectorAll('nav li > :is(a, button)') || []) rename(link);
    }
    for (const item of nav?.querySelectorAll('nav li') || []) {
      if (/\broblox plus\b/i.test(item.textContent) && item.getAttribute('data-n19-rbx') !== 'later') item.setAttribute('data-n19-rbx', 'later');
    }
  };
  net19.watch(run);
  addEventListener('resize', net19.frame(run));
})();
