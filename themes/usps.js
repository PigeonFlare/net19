globalThis.net19Theme = { intended: 'footer a:is([href*="instagram.com"], [href*="threads.net"], [href*="threads.com"])' };
(() => {
  const words = { Send: 'Mail & Ship', Receive: 'Track & Manage', Shop: 'Postal Store' };
  const fix = () => {
    for (const link of document.querySelectorAll('nav[aria-label="Main"] a.menuitem')) {
      for (const node of link.childNodes) {
        const text = node.nodeType === 3 ? node.textContent.trim() : '';
        if (words[text]) node.textContent = node.textContent.replace(text, words[text]);
      }
    }
  };
  const later = net19.frame(fix);
  const start = () => { fix(); new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true }); };
  start();
})();
(() => {
  const root = document.documentElement;
  const mark = () => {
    if (!root.hasAttribute('data-net19-recolor')) return;
    for (const el of document.querySelectorAll('nav[aria-label="Main"] a.menuitem.nav-first-element')) if (!el.hasAttribute('data-net19-keep')) el.setAttribute('data-net19-keep', '');
  };
  const later = net19.frame(mark);
  const start = () => {
    later();
    new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true });
    new MutationObserver(later).observe(root, { attributes: true, attributeFilter: ['data-net19-recolor'] });
  };
  start();
})();
