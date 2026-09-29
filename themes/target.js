globalThis.net19Theme = {
  intended: '#headerPrimary [class*="styles_ndsPopover"][class*="styles_dismissible"], [data-n19-post2019]',
  later: /^(?:ship to location: .+|target circle™?(?: 360™?)?|club target|tiktok)$/i,
};
(() => {
  const root = document.documentElement;
  const SEL = '[class*="styles_storycardWrapper"]:has(:is([class*="customTextPosition"], [class*="flexTextPosition"]))';
  const mark = () => {
    if (!root.hasAttribute('data-net19-flip')) return;
    for (const el of document.querySelectorAll(SEL)) {
      if (el.hasAttribute('data-net19-keep')) continue;
      if (!el.querySelector('[class*="customTextPosition"]')) {
        const box = el.querySelector('[class*="storycardText"]'), text = box?.getBoundingClientRect();
        const over = img => img.width >= 2 && text.left < img.right && img.left < text.right && text.top < img.bottom && img.top < text.bottom;
        const ink = box && [...box.querySelectorAll('h2 *, h2, p')].find(n => n.childElementCount === 0 && n.textContent.trim());
        const light = ink && (c => c && (+c[1] + +c[2] + +c[3]) / 3 > 200)(getComputedStyle(ink).color.match(/(\d+)\D+(\d+)\D+(\d+)/));
        if (!text || !(light || [...el.querySelectorAll('img')].some(img => over(img.getBoundingClientRect())))) continue;
      }
      el.removeAttribute('data-net19-scrim'); el.setAttribute('data-net19-keep', '');
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; mark(); }); };
  const start = () => {
    later();
    new MutationObserver(later).observe(document.body, { childList: true, subtree: true });
    addEventListener('load', later, { once: true });
    new MutationObserver(later).observe(root, { attributes: true, attributeFilter: ['data-net19-flip'] });
  };
  net19.onBody(start);
})();
(() => {
  const fix = () => {
    for (const input of document.querySelectorAll('input[data-test*="SearchInput"]')) if (input.placeholder && input.placeholder !== 'Search') input.placeholder = 'Search';
    const link = document.querySelector('a[data-test="@web/GlobalHeader/UtilityHeader/TargetCircleCard"]');
    if (!link) return;
    if (!/^\s*Target Circle\W*Card\s*$/.test(link.textContent)) return;
    const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
    let first = true;
    for (let node = walker.nextNode(); node; node = walker.nextNode()) { if (!node.data.trim()) continue; node.data = first ? 'RedCard' : ''; first = false; }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
(() => {
  const mark = () => {
    for (const heading of document.querySelectorAll('h3')) {
      if (!/^Get top deals, latest trends, and more\.?$/.test(heading.textContent.trim())) continue;
      const box = heading.parentElement;
      if (box && !box.hasAttribute('data-n19-post2019') && box.querySelector('input')) box.setAttribute('data-n19-post2019', '');
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; mark(); }); };
  const start = () => { mark(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
