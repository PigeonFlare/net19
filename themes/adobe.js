globalThis.net19Theme = { intended: '[data-n19-later]', later: /^(?:create with (?:adobe )?firefly|(?:try |explore |open )?(?:adobe )?firefly(?: [a-z ]*)?|generative ai|acrobat ai assistant|ai assistant(?: for acrobat)?)$/i };
(() => {
  const root = document.documentElement;
  const SEL = '.router-marquee';
  const NAV_NAMES = { 'Products': 'Creativity & Design', 'Solutions': 'Business Solutions', 'Learn & Support': 'Support' };
  const NAV_LATER = /^(Use Cases|Quick Actions|Plans)$/;
  const FOOTER_LATER = /^(Creative AI|Adobe Express|Content supply chain|B2B GTM orchestration|Personalization at scale|Unified customer experience|Adobe for All|Integrity|Chat with sales|3D|Adobe Firefly|Firefly|Adobe Learn|Acrobat AI Assistant|GenStudio.*|B2B CX orchestration|Brand visibility|Customer engagement|Creativity and production|Medium and large business support|Request information)$/;
  const hide = el => { if (el && !el.hasAttribute('data-n19-later')) el.setAttribute('data-n19-later', ''); };
  const relabel = (el, from, to) => { const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); for (let n = walker.nextNode(); n; n = walker.nextNode()) if (n.data.trim() === from) n.data = n.data.replace(from, to); };
  const restore = () => {
    for (const link of document.querySelectorAll('header :is(a, button).feds-link:not([data-n19-seen]), header .feds-navItem > :is(a, button):not([data-n19-seen])')) {
      link.setAttribute('data-n19-seen', '');
      const text = link.textContent.replace(/\s+/g, ' ').trim();
      if (NAV_LATER.test(text)) hide(link.closest('.feds-navItem, li') || link);
      else if (NAV_NAMES[text]) relabel(link, text, NAV_NAMES[text]);
    }
    for (const link of document.querySelectorAll('footer a:not([data-n19-seen]), header a:not([data-n19-seen]):not(.feds-link)')) {
      link.setAttribute('data-n19-seen', '');
      if (FOOTER_LATER.test(link.textContent.replace(/\s+/g, ' ').trim())) hide(link.closest('li') || link);
    }
  };
  const mark = () => {
    restore();
    if (!root.hasAttribute('data-net19-recolor')) return;
    for (const el of document.querySelectorAll(SEL)) if (!el.hasAttribute('data-net19-keep')) { el.removeAttribute('data-net19-scrim'); el.setAttribute('data-net19-keep', ''); }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; mark(); }); };
  const start = () => {
    later();
    new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true });
    new MutationObserver(later).observe(root, { attributes: true, attributeFilter: ['data-net19-recolor'] });
  };
  net19.onBody(start);
})();
