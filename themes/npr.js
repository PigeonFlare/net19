// net19 handmade theme: NPR, 2019. NPR's current design follows the device's light/dark setting through its own
// tokens, so the device decides the mode and the page is never flipped. The section bar gets its 2019 names back
// ("Arts & Life", "Shows & Podcasts").
globalThis.net19Theme = {
  detect: () => (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  later: /^(?:get npr\+|npr\+|newsletters|listen sponsor-free|go sponsor-free|join npr\+|unlock sponsor-free listening)$/i,
};
(() => {
  const NAMES = { 'culture': 'Arts & Life', 'podcasts & shows': 'Shows & Podcasts' };
  const fix = () => {
    // Donate was a black box in 2019; today's is a red pill with a heart.
    for (const a of document.querySelectorAll('.npr-header a')) if (/^\s*donate\s*$/i.test(a.textContent || '') && !a.hasAttribute('data-net19-donate')) a.setAttribute('data-net19-donate', '');
    for (const a of document.querySelectorAll('.menu--main .menu__item-inner > a, .navigation .menu__item > a')) {
      for (const n of a.childNodes) {
        if (n.nodeType !== 3) continue;
        const to = NAMES[n.nodeValue.trim().toLowerCase()];
        if (to) n.nodeValue = n.nodeValue.replace(n.nodeValue.trim(), to);
      }
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
