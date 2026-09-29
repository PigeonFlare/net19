globalThis.net19Theme = {
  detect: () => matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  watch: [],
  intended: '[data-n19-later]',
};
(() => {
  const NAV_LATER = /\/(shop\/goto\/store|store|airpods|shop\/accessories\/all|apple-vision-pro)\/?$/;
  const NAV_NAMES = { 'TV & Home': 'TV', 'Entertainment': 'Music' };
  const FOOTER_LATER = /^(Apple One|Apple Fitness\+|Apple Upgrade|Racial Equity and Justice|Ethics & Compliance|Feature Availability|Carrier Deals at Apple|Group Reservations|Vision|Apple Vision Pro|AirTag|Personal Setup|Shop for K-12|Shop for State and Local Employees|Apple Invites|Apple Sports|Apple Intelligence|AirPods|Store|Apple Store)$/;
  const mark = el => { if (el && !el.hasAttribute('data-n19-later')) el.setAttribute('data-n19-later', ''); };
  const fix = () => {
    for (const item of document.querySelectorAll('#globalnav .globalnav-menu-list > .globalnav-item:not([data-n19-seen])')) {
      const link = item.querySelector(':scope > a, :scope > .globalnav-submenu-trigger-group a');
      if (!link) continue;
      item.setAttribute('data-n19-seen', '');
      const path = new URL(link.href, location.href).pathname;
      const text = link.textContent.trim(), renamed = NAV_NAMES[text];
      if (NAV_LATER.test(path) || /^(Store|Vision|AirPods|Accessories)$/.test(text)) { mark(item); continue; }
      if (renamed) { const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT); for (let n = walker.nextNode(); n; n = walker.nextNode()) if (n.data.trim() === text) n.data = renamed; link.setAttribute('aria-label', renamed); }
    }
    for (const link of document.querySelectorAll(':is(#globalfooter, .globalfooter, footer) a:not([data-n19-seen])')) {
      link.setAttribute('data-n19-seen', '');
      if (FOOTER_LATER.test(link.textContent.replace(/\s+/g, ' ').trim())) mark(link.closest('li') || link);
    }
  };
  const later = net19.watch(fix);
})();
