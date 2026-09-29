globalThis.net19Theme = {
  later: /^(Investor Relations|Data Solutions|Blog for Business|Legal|How Trustpilot works|Trust Report|Download the Trustpilot iOS app|Notifications|May use AI-assist with replies)$/i,
  keep: '[data-testid="company-details-card"] [class*="styles_overlay"]',
  intended: '[data-n19-post], [class*="styles_heroAnimation"], header [class*="notificationsCentre"], main [class*="appBannerWrapper"], main [class*="transparencyLink"], main section:has(a[href$="writeareview"]), main section:has(> [class*="headerBar"] a[href="/categories"]), main [data-constellation-section-theme]:has(> #b2b-promo-banner), main [data-constellation-section-theme="deprecated-orange"], #value-proposition [data-constellation-section-theme="deprecated-dark-green"]',
};
(() => {
  const WORDS = new Map([
    ['Find a company you can trust', 'Behind every review is an experience that matters'],
    ['Discover, read, and write reviews', 'Read reviews. Write reviews. Find companies.'],
    ['For businesses', 'For companies'],
    ['About us', 'About'],
    ['Help Center', 'Support Center'],
    ['Guidelines for Reviewers', 'User Guidelines'],
    ['Summary', 'Overview'],
  ]);
  const hide = el => { if (el && !el.hasAttribute('data-n19-post')) el.setAttribute('data-n19-post', ''); };
  const byHeading = (pattern, container) => {
    for (const h of document.querySelectorAll('main :is(h2, h3, h4)')) if (pattern.test(h.textContent.trim())) hide(h.closest(container));
  };
  const fix = () => {
    for (const a of document.querySelectorAll('header a[href$="writeareview"], header a[href="/blog"], header a[href$="trustpilot.com/blog"]')) hide(a);
    hide(document.querySelector('header [class*="notificationsCentre"]'));
    for (const a of document.querySelectorAll('main a[href$="writeareview"]')) if (/Bought something/i.test(a.closest('section')?.textContent || '')) hide(a.closest('section'));
    byHeading(/^What are you looking for\?$/, 'section');
    byHeading(/^Pick up where you left off$/, 'section');
    if (location.pathname === '/') for (const a of document.querySelectorAll('main a')) if (/^Leave a review$/.test(a.textContent.trim())) hide(a.closest('section'));
    byHeading(/^Help millions make the right choice$/, '[data-constellation-section-theme]');
    byHeading(/Trust Report/i, '[data-constellation-section-theme="deprecated-dark-green"], [class*="CDS_Card_card"]');
    byHeading(/^Top mentions$/, 'section, [class*="styles_topics"], div:has(> [role="list"])');
    hide(document.getElementById('b2b-promo-banner')?.closest('[data-constellation-section-theme]') || document.getElementById('b2b-promo-banner'));
    for (const a of document.querySelectorAll('main a[href*="apps.apple.com"], main a[href*="play.google.com"]')) hide(a.closest('[class*="appBannerWrapper"]') || a);
    for (const a of document.querySelectorAll('footer a[href*="apps.apple.com"], footer a[href*="play.google.com"]')) hide(a.closest('li') || a);
    hide(document.querySelector('main [class*="transparencyLink"]'));
    for (const nav of document.querySelectorAll('main nav[aria-label="Breadcrumb" i], main nav:has(> ol li a[href^="/categories/"])')) if (location.pathname.startsWith('/review/')) hide(nav);
    for (const banner of document.querySelectorAll('main [class*="styles_banners"] > [role="button"][aria-controls]')) if (/merged|human content|AI/i.test(banner.textContent)) hide(banner);
    for (const input of document.querySelectorAll('main input[placeholder^="Search by keyword" i]')) hide(input.closest('form, [role="search"]') || input.parentElement);
    for (const p of document.querySelectorAll('main :is(p, h3, h4)')) if (/^May use AI-assist/i.test(p.textContent.trim())) hide(p);
    for (const b of document.querySelectorAll('[class*="styles_heroSearch"] button[class*="CDS_Button_circle"]:not([data-n19-label])')) b.setAttribute('data-n19-label', 'Search');
    for (const el of document.querySelectorAll('header a, header button, footer a, main h1, main h2, [role="tab"], main nav button')) {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const to = WORDS.get(node.data.trim());
        if (to) { node.data = to; break; }
      }
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true }); };
  if (document.body) start(); else new MutationObserver((_, o) => { if (document.body) { o.disconnect(); start(); } }).observe(document.documentElement, { childList: true });
})();
(() => {
  const root = document.documentElement;
  const mark = () => {
    if (!root.hasAttribute('data-net19-flip')) return;
    const hero = document.querySelector('[class*="styles_heroContainer"]');
    if (hero && !hero.hasAttribute('data-net19-keep')) { hero.removeAttribute('data-net19-scrim'); hero.setAttribute('data-net19-keep', ''); }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; mark(); }); };
  const start = () => {
    later();
    new MutationObserver(later).observe(document.body, { childList: true, subtree: true });
    new MutationObserver(later).observe(root, { attributes: true, attributeFilter: ['data-net19-flip'] });
  };
  if (document.body) start(); else new MutationObserver((_, o) => { if (document.body) { o.disconnect(); start(); } }).observe(document.documentElement, { childList: true });
})();
