globalThis.net19Theme = {
  detect: () => document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  watch: ['class'],
  only: () => /^\/(?:design|folder|projects|brand|settings|your-projects|s\/|teams|content-planner)(?:\/|$)/.test(location.pathname)
    ? (document.documentElement.classList.contains('dark') ? 'dark' : 'light') : undefined,
  light: { '#8b3dff': '#00c4cc', '#7d2ae8': '#00b1b9', '#7731d8': '#00a3aa', '#6420ff': '#00c4cc' },
  dark: { '#8b3dff': '#00c4cc', '#7d2ae8': '#00b1b9', '#7731d8': '#00a3aa', '#6420ff': '#00c4cc' },
  later: /^(?:AI [\w ]+|[\w ]+ AI|All Canva AI|Canva AI[\w ]*|Canva Code|Magic (?:Write|Animate|Layers|Insights|Formulas|Media|Design|Studio)|Text to speech voiceover|Image enhancer|Marketing and AI)$/i,
};
(() => {
  const APP = /^\/(?:design|folder|projects|brand|settings|your-projects|s\/|teams|content-planner)(?:\/|$)/;
  const mark = () => document.documentElement.toggleAttribute('data-net19-app', APP.test(location.pathname) || !!document.querySelector('#root [data-testid="editor"], #root [aria-label="Canvas" i]'));
  mark();
  globalThis.navigation?.addEventListener?.('currententrychange', mark);
  addEventListener('popstate', mark);
  document.addEventListener('DOMContentLoaded', mark, { once: true });
})();
(() => {
  const fix = () => {
    const h1 = document.querySelector('#root main h1');
    const box = h1?.parentElement;
    if (!box) return;
    const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) if (/\bAI-powered\s+/i.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/\bAI-powered\s+/gi, '');
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
