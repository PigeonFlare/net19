globalThis.net19Theme = {
  detect: () => 'light',
  later: /^(?:follow|following)$/i,
  intended: '[data-n19-later], [class*="NewsletterOptinContainer"], #react-header li:has(> [class*="NavItemInner"] > a:is([href="/milb"], [href^="/youth-baseball"]))',
};
(() => {
  const relabel = () => {
    for (const link of document.querySelectorAll('#react-header a[href^="/tv"]')) {
      for (const node of link.querySelectorAll('span, a')) if (node.childElementCount === 0 && node.textContent.trim() === 'Watch') node.textContent = 'Video';
      if (link.childElementCount === 0 && link.textContent.trim() === 'Watch') link.textContent = 'Video';
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; relabel(); }); };
  const start = () => { relabel(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else new MutationObserver((_, o) => { if (document.body) { o.disconnect(); start(); } }).observe(document.documentElement, { childList: true });
})();
