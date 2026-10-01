globalThis.net19Theme = { intended: '[data-n19-later]' };
(() => {
  const root = document.documentElement;
  const photo = el => [el, ...el.querySelectorAll('div')].slice(0, 60).some(d => !d.hasAttribute('data-n19-photo') && getComputedStyle(d).backgroundImage.includes('url('));
  const keep = el => { if (el && !el.hasAttribute('data-net19-keep')) { el.removeAttribute('data-net19-scrim'); el.setAttribute('data-net19-keep', ''); } };
  const mark = () => {
    if (!root.hasAttribute('data-net19-recolor')) return;
    for (const h1 of document.querySelectorAll('main h1')) {
      const hero = h1.closest('main > div');
      if (!hero || hero.hasAttribute('data-net19-keep') || hero.querySelector('input[id^="location-typeahead-home"]') || !photo(hero)) continue;
      keep(hero);
      const header = document.querySelector('[data-testid="header-v2-wrapper"]');
      if (header && getComputedStyle(header.parentElement).position === 'absolute') keep(header);
    }
  };
  const later = net19.frame(mark);
  const start = () => {
    later();
    new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true });
    new MutationObserver(later).observe(root, { attributes: true, attributeFilter: ['data-net19-recolor'] });
  };
  start();
})();
(() => {
  const mark = () => {
    for (const el of document.querySelectorAll('main a, main button')) {
      if (!el.hasAttribute('data-n19-find') && /^\s*Find food\s*$/i.test(el.textContent) && !el.querySelector('img')) el.setAttribute('data-n19-find', '');
    }
  };
  const later = net19.frame(mark);
  const start = () => { later(); new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true }); };
  start();
})();
(() => {
  const TEXT = { 'Order delivery near you': 'Discover restaurants that deliver near you', 'Search here': 'Find Food' };
  const LATER = /^(Get a ride|Shop groceries|Promotions|Pickup near me|Feed your employees|Create a business account)/;
  const mark = () => {
    const hero = document.querySelector('main input[id^="location-typeahead-home"]')?.closest('main > div');
    if (hero) for (const d of hero.querySelectorAll('div')) {
      if (d.hasAttribute('data-n19-photo') || d.childElementCount || d.getBoundingClientRect().width < 600) continue;
      if (!getComputedStyle(d).backgroundImage.includes('url(')) continue;
      d.setAttribute('data-n19-photo', '');
      if (d.parentElement !== hero && d.parentElement.childElementCount === 1) d.parentElement.setAttribute('data-n19-photo', '');
    }
    for (const el of document.querySelectorAll('main h1, main button, main a')) {
      if (el.childElementCount) continue;
      const to = TEXT[el.textContent.trim()];
      if (to) el.textContent = to;
    }
    for (const el of document.querySelectorAll('header a, footer a, main a, main h2, main h3, [data-testid="header-v2-wrapper"] a')) {
      if (el.hasAttribute('data-n19-later') || !LATER.test(el.textContent.trim())) continue;
      let card = el.closest('li') || el;
      if (el.closest('main')) for (let n = el.parentElement; n && n.tagName !== 'MAIN'; n = n.parentElement) { if (n.querySelector('img') && n.querySelectorAll('a').length <= 2) { card = n; } else if (n.querySelector('img')) break; }
      card.setAttribute('data-n19-later', '');
    }
  };
  const later = net19.frame(mark);
  const start = () => { mark(); new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true, characterData: true }); };
  start();
})();
