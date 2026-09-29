globalThis.net19Theme = {
  later: /^(Advocacy|Learn|Trulia|StreetEasy|HotPads|Out East|Visit us on Instagram|Visit us on TikTok|Download on the App Store|Get it on Google play)$/i,
  intended: '[data-n19-post]',
};
(() => {
  const words = { 'Get a mortgage': 'Home Loans', 'Find an agent': 'Agent finder', 'Manage rentals': 'List your rental', 'Get help': 'Help' };
  const LATER_SECTIONS = /^(Get home recommendations|Find homes you can afford with BuyAbility.*|About Zillow.s Recommendations)$/i;
  const fix = () => {
    const hero = document.querySelector('.with-product-nav__top-and-main h1');
    if (hero && /^Rentals\. Homes\./.test(hero.textContent.trim())) hero.textContent = 'Reimagine home';
    if (location.pathname === '/') for (const heading of document.querySelectorAll('main :is(h2, h3, h4)')) {
      if (!LATER_SECTIONS.test(heading.textContent.trim())) continue;
      let block = heading;
      while (block.parentElement && block.parentElement.tagName !== 'MAIN' && block.parentElement !== document.body && !block.parentElement.querySelector('h1, form, input') && block.parentElement.querySelectorAll('h2, h3, h4').length <= 1) block = block.parentElement;
      if (!block.hasAttribute('data-n19-post')) block.setAttribute('data-n19-post', '');
    }
    for (const span of document.querySelectorAll('.znav-links li > a > span')) {
      const node = span.firstChild;
      const text = node?.nodeType === 3 ? node.textContent.trim() : '';
      if (words[text]) node.textContent = words[text] + ' ';
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
