globalThis.net19Theme = {
  detect: () => 'light',
  intended: '.live-updates-banner, [data-net19-live], .daily-checklist-js',
  later: /^(?:notifications?|open notifications|support us|support the free press|join huffpost|become a member|power our journalism|leave a comment|view comments|comments|save|save article|bookmark|21 years of the huffington post|thank you!?)$/i,
};
(() => {
  const fix = () => {
    for (const a of document.querySelectorAll('a[href="/voices/"], a[href$="huffpost.com/voices/"]')) for (const n of a.childNodes) if (n.nodeType === 3 && /^\s*voices\s*$/i.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/voices/i, m => m === 'VOICES' ? 'COMMUNITY' : 'Community');
    for (const el of document.querySelectorAll('#masthead ~ * span, #masthead ~ * a, #masthead ~ * div, .subnav-container ~ * span, .subnav-container ~ * a')) {
      if (el.children.length || !/^\s*live updates\s*$/i.test(el.textContent || '')) continue;
      const bar = el.closest('[class*="live" i], [class*="banner" i], [class*="alert" i]');
      if (bar && bar.getBoundingClientRect().height < 120) bar.setAttribute('data-net19-live', '');
    }
  };
  net19.watch(fix);
})();
