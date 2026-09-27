globalThis.net19Theme = {
  keep: '#gwm-Deck :is([class*="card_style_text__"], [class*="card_style_wdHeader__"])',
};
(() => {
  const WORDS = [['#nav-hamburger-menu .hm-icon-label', /^\s*All\s*$/, 'Departments'], ['#nav-link-accountList-nav-line-1', /^Hello, sign in$/, 'Hello, Sign in'],
    ['#glow-ingress-line1', /^(\s*)Delivering to\b/, '$1Deliver to']];
  const fix = () => {
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
