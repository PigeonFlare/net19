// net19 handmade theme: Canva marketing pages, 2019. Canva marks its color scheme with html.theme.light / html.theme.dark.
globalThis.net19Theme = {
  detect: () => document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  watch: ['class'],
  // The editor and the signed-in app are never flipped: a flip would invert the colors of the user's own designs.
  only: () => /^\/(?:design|folder|projects|brand|settings|your-projects|s\/|teams|content-planner)(?:\/|$)/.test(location.pathname)
    ? (document.documentElement.classList.contains('dark') ? 'dark' : 'light') : undefined,
  // Canva's 2021 violet (buttons, toggles, badges) back to 2019's teal, wherever the page declares it as a variable
  light: { '#8b3dff': '#00c4cc', '#7d2ae8': '#00b1b9', '#7731d8': '#00a3aa', '#6420ff': '#00c4cc' },
  dark: { '#8b3dff': '#00c4cc', '#7d2ae8': '#00b1b9', '#7731d8': '#00a3aa', '#6420ff': '#00c4cc' },
  // Menu entries for tools that arrived after 2019 (the AI generators, Magic Write and friends, Canva Code)
  later: /^(?:AI [\w ]+|[\w ]+ AI|All Canva AI|Canva AI[\w ]*|Canva Code|Magic (?:Write|Animate|Layers|Insights|Formulas|Media|Design|Studio)|Text to speech voiceover|Image enhancer|Marketing and AI)$/i,
};
// The editor and the signed-in app (designs, folders, projects, brand, settings) are marked so the marketing-page
// rules stay off them.
(() => {
  const APP = /^\/(?:design|folder|projects|brand|settings|your-projects|s\/|teams|content-planner)(?:\/|$)/;
  const mark = () => document.documentElement.toggleAttribute('data-net19-app', APP.test(location.pathname) || !!document.querySelector('#root [data-testid="editor"], #root [aria-label="Canvas" i]'));
  mark();
  // Canva moves between pages without reloading: follow its navigations.
  globalThis.navigation?.addEventListener?.('currententrychange', mark);
  addEventListener('popstate', mark);
  document.addEventListener('DOMContentLoaded', mark, { once: true });
})();
// 2019 wording: the hero subtitle had no "AI-powered" (Canva's AI tools arrived in 2022).
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
