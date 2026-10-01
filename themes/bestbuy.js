globalThis.net19Theme = {
  later: /^(My Best Buy Memberships|Lease to Own|Buy Now, Pay Later|Best Buy Business Financing|Shop with an Expert|Manage an Appointment|Sell on Best Buy Marketplace|Affiliates: Creators & Publishers|Best Buy Health|Partner\+?|Sustainability|Share on (TikTok|YouTube|X)|Discover)$/,
  intended: '[data-testid="sponsored-marquee-lv"], [id^="atwb-marquee-preflight"], [data-testid="story-block-sign_in_create_account"], button[data-testid="chip-discover"]',
};
(() => {
  const WORDS = [['button[data-testid="chip-shop"]', /^Shop$/, 'Products'], ['button[data-testid="chip-support-services"], button[aria-label="Support & Services"]', /^Support & Services$/, 'Services']];
  const fix = () => {
    for (const badge of document.querySelectorAll('[data-testid="badge-container"]:not([data-net19-hidden]), [class*="badge" i]:not([data-net19-hidden])')) if (/^Trending Deal$/.test(badge.textContent.trim())) badge.setAttribute('data-net19-hidden', '');
    for (const [selector, from, to] of WORDS) {
      const el = document.querySelector(selector);
      if (!el) continue;
      net19.rename(el, from, to);
    }
  };
  net19.watch(fix, { childList: true, subtree: true, characterData: true });
})();
(() => {
  const root = document.documentElement;
  const SEL = '[data-testid="hero-banner"]';
  const mark = () => {
    if (!root.hasAttribute('data-net19-recolor')) return;
    for (const el of document.querySelectorAll(SEL)) if (!el.hasAttribute('data-net19-keep')) { el.removeAttribute('data-net19-scrim'); el.setAttribute('data-net19-keep', ''); }
  };
  const later = net19.frame(mark);
  net19.onBody(() => { new MutationObserver(later).observe(root, { attributes: true, attributeFilter: ['data-net19-recolor'] }); });
  net19.watch(mark);
})();
