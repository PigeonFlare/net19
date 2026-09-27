globalThis.net19Theme = {
  detect: () => 'light',
  later: /^(?:givebutter wallet|wallet|earn rewards on every donation|givebutter plus|the spread|ask ai|ai writer|write with ai|generate with ai)$/i,
};
(() => {
  const navLabels = new Map([['Log in', 'Sign in'], ['Sign up for free', 'Sign up']]);
  const relabel = () => {
    for (const button of document.querySelectorAll('.navbar_v2 :is(.navbar_button2, .navbar_button, .navbar_button_secondary2, .navbar_button_secondary)')) {
      for (const node of button.childNodes) {
        if (node.nodeType !== 3) continue;
        const renamed = navLabels.get(node.nodeValue.trim());
        if (renamed) node.nodeValue = renamed;
      }
    }
  };
  const start = () => { relabel(); new MutationObserver(() => requestAnimationFrame(relabel)).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
