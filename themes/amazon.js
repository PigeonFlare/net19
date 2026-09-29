globalThis.net19Theme = {
  keep: '#gwm-Deck :is([class*="card_style_text__"], [class*="card_style_wdHeader__"])',
  later: /^(Pharmacy|Amazon Pharmacy|Amazon Haul|Haul|See options)$/,
  intended: '[data-component-type="s-messaging-widget-results-header"], #productOverview_feature_div, #compatibilityContainerDesktop, [id^="topRefinements/"], #navFooter :is(td, li):has(> a[href*="veeqo"], > a[href*="blinkforhome"]), [data-n19-over]',
};
(() => {
  const WORDS = [['#nav-link-accountList-nav-line-1', /^Hello, sign in$/, 'Hello, Sign in'],
    ['#glow-ingress-line1', /^(\s*)Delivering to\b/, '$1Deliver to'],
    ['#nav-orders .nav-line-2', /^(\s*)&\s*Orders/, '$1Orders']];
  const fix = () => {
    for (const el of document.querySelectorAll('[id$="-ac-desktop-declarative"] span, #acBadge_feature_div span')) {
      const text = el.firstChild;
      if (el.childElementCount === 0 && text?.nodeType === 3 && /^\s*Overall Pick\s*$/.test(text.data)) text.data = "Amazon's Choice";
    }
    const shelf = document.querySelector('#nav-xshop');
    const tools = document.querySelector('#nav-tools');
    if (shelf && tools) {
      const fill = shelf.closest('.nav-fill');
      const clip = fill ? fill.getBoundingClientRect().right - parseFloat(getComputedStyle(fill).paddingRight || '0') : Infinity;
      const limit = Math.min(tools.getBoundingClientRect().left - 8, clip);
      for (const link of shelf.querySelectorAll(':scope > ul > li, :scope > a, :scope > div')) {
        if (link.hasAttribute('data-n19-over')) continue;
        if (link.getBoundingClientRect().right > limit) link.setAttribute('data-n19-over', '');
      }
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
  net19.onBody(start);
})();
