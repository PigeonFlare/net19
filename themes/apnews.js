globalThis.net19Theme = {
  detect: () => 'light',
  later: /^(?:add ap news on google|ap news on google|get the ap news app|download the app|live|live updates|listen to this article|gift this article|donate now|collapse donation banner)$/i,
  intended: '[data-n19-later], .bcpNotificationBar, .bx-client, [id^="bx-campaign-"], iframe.bx-gbi-frame, .Page-header-stickyWrap bsp-banner.Banner, .Page-header-bar a[href*="donate" i], .Page-header-sign-in, .HtmlModule:has(a[href$="apnews.com/games"]), .FooterNavigationItem-items-item:has(> a:is([href*="apstylebook.com"], [href*="leads.ap.org"], [href*="contentservices.ap.org"])), .Page-footer .SocialBar, .Author-socialLinks',
};
(() => {
  const fix = () => {
    for (const el of document.querySelectorAll('.MainNavigationItem-more')) for (const n of el.childNodes) if (n.nodeType === 3 && /^\s*MORE\s*$/.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace('MORE', 'More');
    for (const button of document.querySelectorAll('button[aria-label="Collapse donation banner"]')) {
      let box = button.parentElement;
      while (box && box !== document.body && !box.querySelector('h1, h2, h3')) box = box.parentElement;
      if (box && box !== document.body) box.setAttribute('data-n19-later', '');
    }
    for (const title of document.querySelectorAll('.PageList-header-title')) {
      if (title.textContent.trim() === 'Short Stories') title.closest('[data-module], .PageList, bsp-playlist-module-carousel')?.setAttribute('data-n19-later', '');
    }
  };
  const start = () => { fix(); new MutationObserver(() => requestAnimationFrame(fix)).observe(document.body, { childList: true, subtree: true }); };
  net19.onBody(start);
})();
