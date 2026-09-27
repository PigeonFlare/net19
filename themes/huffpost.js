globalThis.net19Theme = {
  detect: () => 'light',
  later: /^(?:notifications?|open notifications|support us|support the free press|join huffpost|become a member|power our journalism|leave a comment|view comments|comments|save|save article|bookmark|21 years of the huffington post|thank you!?)$/i,
};
(() => {
  const fix = () => {
    for (const el of document.querySelectorAll('#masthead ~ * span, #masthead ~ * a, #masthead ~ * div, .subnav-container ~ * span, .subnav-container ~ * a')) {
      if (el.children.length || !/^\s*live updates\s*$/i.test(el.textContent || '')) continue;
      const bar = el.closest('[class*="live" i], [class*="banner" i], [class*="alert" i]');
      if (bar && bar.getBoundingClientRect().height < 120) bar.setAttribute('data-net19-live', '');
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
