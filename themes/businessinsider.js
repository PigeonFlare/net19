globalThis.net19Theme = {
  later: /^(?:gift article|save this article|listen to this article|tour|get the app|get the business insider app)$/i,
  keepLabels: /^(?:read)$/i,
  intended: 'a.tout-tag-link[href="/artificial-intelligence"], section.comments, .inline-backup-paywall, .trending-bar-section, .sub-section-app-store, section.latest-feed header.filters, .bifrost-entry.bottom, [data-n19-later]',
};
(() => {
  const fix = () => {
    for (const el of document.querySelectorAll('.trending-bar span, .trending-bar div, .trending-bar em, .trending-bar strong')) {
      if (el.childElementCount === 0 && /^\s*(new|sign up)\s*$/i.test(el.textContent || '')) el.setAttribute('data-net19-hidden', '');
    }
    for (const offer of document.querySelectorAll('button, a')) {
      if (!/^\s*Go Ad-free\s*$/i.test(offer.textContent || '')) continue;
      offer.closest('[class*="bifrost"], [class*="paywall"], [class*="drawer"], [role="dialog"]')?.setAttribute('data-n19-later', '');
    }
  };
  const later = net19.watch(fix);
})();
