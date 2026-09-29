globalThis.net19Theme = { intended: '[data-n19-later]', later: /^(?:ask learn|summarize this article(?: for me)?|ask copilot|try copilot(?: free)?|get copilot|copilot(?: pro| app)?|microsoft 365 copilot(?: app)?)$/i };
(() => {
  const root = document.documentElement;
  const SEL = 'store-hero-featured-xl-video, store-hero-featured-slider-item';
  const NAMES = { 'Microsoft 365': 'Office', 'XBOX': 'Xbox' };
  const LATER_LINKS = /^(Azure|Copilot|Small Business|Explore Copilot|Microsoft AI|AI for education|Support for AI marketplace apps|Microsoft Copilot)$/;
  const later2019 = el => { if (el && !el.hasAttribute('data-n19-later')) el.setAttribute('data-n19-later', ''); };
  const relabel = (el, from, to) => { const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); for (let n = walker.nextNode(); n; n = walker.nextNode()) if (n.data.trim() === from) n.data = n.data.replace(from, to); };
  const restore = () => {
    for (const link of document.querySelectorAll('header a:not([data-n19-seen]), footer a:not([data-n19-seen]), main a:not([data-n19-seen])')) {
      link.setAttribute('data-n19-seen', '');
      const text = link.textContent.replace(/\s+/g, ' ').trim();
      if (LATER_LINKS.test(text) && (link.closest('header, footer') || /copilot|\/ai\b|\/ai\//i.test(link.href))) later2019(link.closest('li') || link);
      else if (NAMES[text] && link.closest('header')) relabel(link, text, NAMES[text]);
    }
    for (const button of document.querySelectorAll('header button[aria-label="Search or ask a question"]')) button.setAttribute('aria-label', 'Search Microsoft.com');
    for (const block of document.querySelectorAll('store-featured store-heading-block:not([data-n19-seen])')) {
      block.setAttribute('data-n19-seen', '');
      if (block.querySelector('h1') || /AI-powered/i.test(block.textContent)) later2019(block);
    }
    for (const tab of document.querySelectorAll('store-featured store-tabs store-tab')) later2019(tab.closest('store-scrollslider-item') || tab);
    for (const heading of document.querySelectorAll('main h2:not([data-n19-seen])')) {
      heading.setAttribute('data-n19-seen', '');
      if (!/\b(AI|Copilot)\b/.test(heading.textContent)) continue;
      let block = heading;
      while (block.parentElement && block.parentElement !== document.body && block.parentElement.querySelectorAll('h1, h2').length === 1) block = block.parentElement;
      later2019(block);
    }
  };
  const mark = () => {
    restore();
    if (!root.hasAttribute('data-net19-flip')) return;
    for (const el of document.querySelectorAll(SEL)) if (!el.hasAttribute('data-net19-keep')) { el.removeAttribute('data-net19-scrim'); el.setAttribute('data-net19-keep', ''); }
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
