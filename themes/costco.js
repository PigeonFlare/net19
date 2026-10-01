globalThis.net19Theme = {
  keep: '[data-testid="Link_homepagelink_SearchStrip"] svg',
  later: /^(Refer a Friend|Explore Our Brands|Product Collections|Costco TikTok|Costco Instagram|Costco App|Digital Connection|Membership Benefits|Executive Member Benefits)$/,
  intended: '[data-testid^="CriteoAdSet"], [role="region"][aria-label="Sponsored Products"], [role="region"][aria-label="Email Sign Up Form"], [data-testid="AnnouncementBanner"], [data-testid="ordersAndReturns"], nav[aria-label="Main"] li:has(a:is([href*="sameday.costco.com"], [href^="/s?keyword=OFF"]))',
};
(() => {
  const WORDS = [['[data-testid="Button_shop-menu-button"]', /^Shop$/, 'Shop All Departments'], ['[data-testid="Buy Again"]', /^Buy Again$/, 'Reorder']];
  const fix = () => {
    for (const [selector, from, to] of WORDS) {
      const el = document.querySelector(selector);
      if (!el) continue;
      net19.rename(el, from, to);
    }
  };
  net19.watch(fix, { childList: true, subtree: true, characterData: true });
})();
