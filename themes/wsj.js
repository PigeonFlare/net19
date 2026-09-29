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
  net19.watch(hideCta);
})();
