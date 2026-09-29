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
  net19.watch(relabel);
})();
