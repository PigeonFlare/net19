globalThis.net19Theme = {};  // Target has no dark mode; default detection keeps it light.
// On a dark device the page is flipped by palette.js. Story cards set white headlines straight on their photos, so flipped, their white text would turn dark on
// the photo: those parts are kept as drawn instead.
(() => {
  const root = document.documentElement;
  const SEL = '[class*="styles_storycardWrapper"]:has(:is([class*="customTextPosition"], [class*="flexTextPosition"]))';
  const mark = () => {
    if (!root.hasAttribute('data-net19-flip')) return;
    for (const el of document.querySelectorAll(SEL)) {
      if (el.hasAttribute('data-net19-keep')) continue;
      // Flex-positioned text can sit beside the photo as well as over it: only cards whose text overlaps a photo, or whose
      // headline is set in light type, are kept.
      if (!el.querySelector('[class*="customTextPosition"]')) {
        const box = el.querySelector('[class*="storycardText"]'), text = box?.getBoundingClientRect();
        const over = img => img.width >= 2 && text.left < img.right && img.left < text.right && text.top < img.bottom && img.top < text.bottom;
        // Light (white) headline type is drawn for a dark picture behind it, even where that picture is not the first image
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
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
// 2019 wording: the card in the utility row was the RedCard (renamed "Target Circle Card" in 2024).
(() => {
  const fix = () => {
    const link = document.querySelector('a[data-test="@web/GlobalHeader/UtilityHeader/TargetCircleCard"]');
    if (!link) return;
    if (!/^\s*Target Circle\W*Card\s*$/.test(link.textContent)) return;
    // The words are split across nodes (the trademark sign is its own element): the first text node takes the whole
    // label and the rest are emptied.
    const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
    let first = true;
    for (let node = walker.nextNode(); node; node = walker.nextNode()) { if (!node.data.trim()) continue; node.data = first ? 'RedCard' : ''; first = false; }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  // Watched from document start: the header renders long before a slow page's DOMContentLoaded.
  new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
