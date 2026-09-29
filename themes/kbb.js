globalThis.net19Theme = {
  later: /^(Private Seller Listings|Electric Vehicle Guide|Car Match Quiz|Videos|Car Finance Guide|Car Depreciation|Car Financing 101|Deals & Incentives|Dealer Reviews & Ratings|KBB Canada|Facebook Icon|X Icon|RSS Icon|LinkedIn Icon|YouTube Icon)$/i,
  intended: '[data-n19-post]',
};
(() => {
  const NAV = new Map([['Sell My Car', 'Car Values'], ['Shop & Buy', 'Cars for Sale'], ['Research & Advice', 'Car Reviews'], ['Finance & Costs', 'Research Tools']]);
  const fix = () => {
    const hero = document.getElementById('superheroSection');
    const h1 = hero?.querySelector('h1');
    if (h1 && /^\s*Kelley Knows Cars\.?\s*$/.test(h1.textContent)) h1.textContent = 'Car Shopping Made Easy';
    const sub = h1?.nextElementSibling;
    if (sub?.tagName === 'H2' && /values to repairs/i.test(sub.textContent)) sub.textContent = 'KBB.com is your one-stop resource';
    for (const link of document.querySelectorAll('kbb-global-nav nav a')) {
      const text = link.textContent.trim();
      if (text === 'Service & Repair') { const item = link.closest('nav nav > div') || link; if (!item.hasAttribute('data-n19-post')) item.setAttribute('data-n19-post', ''); continue; }
      const to = NAV.get(text);
      if (!to) continue;
      const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) if (node.data.trim() === text) { node.data = to; break; }
    }
    for (const heading of document.querySelectorAll('#content h2')) if (/^Kelley Knows Motorcycles/i.test(heading.textContent.trim())) { const block = heading.closest('[data-cy="SectionWrapper"]'); if (block && !block.hasAttribute('data-n19-post')) block.setAttribute('data-n19-post', ''); }
    for (const heading of document.querySelectorAll('#content :is(h2, h3)')) {
      if (!/^Facing a Repair\?$/.test(heading.textContent.trim())) continue;
      let block = heading;
      while (block.parentElement && block.parentElement !== document.body && !block.parentElement.querySelector('h1, form, input') && block.parentElement.querySelectorAll('h2, h3').length <= 1) block = block.parentElement;
      if (!block.hasAttribute('data-n19-post')) block.setAttribute('data-n19-post', '');
    }
    return !!h1;
  };
  let queued = false, observer = null;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => {
    fix();
    observer = new MutationObserver(later);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  };
  if (document.body) start(); else new MutationObserver((_, o) => { if (document.body) { o.disconnect(); start(); } }).observe(document.documentElement, { childList: true });
})();
