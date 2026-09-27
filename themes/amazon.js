// net19 handmade theme: amazon. The site has a single (light) design, so the light palette applies and dark devices
// get the engine's inverted page. The 2019 nav wording is restored in place: the later "All" menu button reads
// "Departments", "Hello, sign in" is "Hello, Sign in", and "Delivering to" is "Deliver to", and the "Overall Pick" badge is "Amazon's Choice" again.
globalThis.net19Theme = {
  // The gateway's top tiles write their headline and button over the tile's photo, in colors drawn for that photo:
  // on dark devices they stay as drawn with it instead of flipping (white headlines turned black over the kept photo).
  keep: '#gwm-Deck :is([class*="card_style_text__"], [class*="card_style_wdHeader__"])',
};
(() => {
  const WORDS = [['#nav-hamburger-menu .hm-icon-label', /^\s*All\s*$/, 'Departments'], ['#nav-link-accountList-nav-line-1', /^Hello, sign in$/, 'Hello, Sign in'],
    ['#glow-ingress-line1', /^(\s*)Delivering to\b/, '$1Deliver to']];
  const fix = () => {
    // "Overall Pick" (2023) is the Amazon's Choice badge renamed; its label went back to the 2019 words.
    for (const el of document.querySelectorAll('[id$="-ac-desktop-declarative"] span, #acBadge_feature_div span')) {
      const text = el.firstChild;
      if (el.childElementCount === 0 && text?.nodeType === 3 && /^\s*Overall Pick\s*$/.test(text.data)) text.data = "Amazon's Choice";
    }
    for (const [selector, from, to] of WORDS) {
      const el = document.querySelector(selector);
      const text = el?.firstChild;
      if (text?.nodeType === 3 && from.test(text.data)) text.data = text.data.replace(from, to);
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => {
    fix();
    new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true });
  };
  if (document.readyState !== 'loading') start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
