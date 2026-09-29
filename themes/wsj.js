globalThis.net19Theme = {
  only: () => (/^\/video(?:\/|$)/.test(location.pathname) ? 'dark' : undefined),
  later: /^(?:listen(?: \(\d+ min(?:ute)?s?\))?|key points|show key points|what'?s this\?|follow|following|get wsj\+|wsj\+)$/i,
  keepLabels: /^(?:follow us|follow wsj)$/i,
};
(() => {
  const hideCta = () => {
    const root = document.querySelector('nav-hat')?.shadowRoot;
    if (!root || root.querySelector('style[data-net19]')) return;
    const style = document.createElement('style');
    style.setAttribute('data-net19', '');
    style.textContent = '.cta { display: none !important; }';
    root.append(style);
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; hideCta(); }); };
  const start = () => { hideCta(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else new MutationObserver((_, o) => { if (document.body) { o.disconnect(); start(); } }).observe(document.documentElement, { childList: true });
})();
