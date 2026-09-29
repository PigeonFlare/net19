globalThis.net19Theme = {
  keep: 'main .welcome, a.global-btn-green',
  later: /^(?:viber pay(?: faqs)?|.{0,24}\bviber pay\b.{0,24}|chatgpt in viber|ai on viber|viber ai(?: .*)?|ai (?:chats?|assistants?|summar(?:y|ies)|features?)(?: on viber)?)$/i,
};
(() => {
  const LATER = /^(US Privacy Settings|Caller ID Opt Out|About Rakuten)$/i;
  const LATER_FEATURES = /^(Delete & Edit seen messages|Set Disappearing Messages)$/i;
  const fix = () => {
    for (const heading of document.querySelectorAll('main h4, main h3')) {
      if (!LATER_FEATURES.test(heading.textContent.trim())) continue;
      let block = heading.parentElement;
      while (block && block.parentElement && block.parentElement.querySelectorAll('h4').length === 1) block = block.parentElement;
      if (block && !block.hasAttribute('data-net19-hidden')) block.setAttribute('data-net19-hidden', '');
    }
    for (const link of document.querySelectorAll('footer a, .footer a')) {
      if (!LATER.test(link.textContent.trim())) continue;
      const item = link.closest('li') || link;
      if (!item.hasAttribute('data-net19-hidden')) item.setAttribute('data-net19-hidden', '');
    }
  };
  const start = () => { fix(); new MutationObserver(() => requestAnimationFrame(fix)).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else new MutationObserver((_, o) => { if (document.body) { o.disconnect(); start(); } }).observe(document.documentElement, { childList: true });
})();
