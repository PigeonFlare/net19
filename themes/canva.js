globalThis.net19Theme = {
  detect: () => document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  watch: ['class'],
  only: () => /^\/(?:design|folder|projects|brand|settings|your-projects|s\/|teams|content-planner)(?:\/|$)/.test(location.pathname)
    ? (document.documentElement.classList.contains('dark') ? 'dark' : 'light') : undefined,
  light: { '#8b3dff': '#00c4cc', '#7d2ae8': '#00b1b9', '#7731d8': '#00a3aa', '#6420ff': '#00c4cc' },
  dark: { '#8b3dff': '#00c4cc', '#7d2ae8': '#00b1b9', '#7731d8': '#00a3aa', '#6420ff': '#00c4cc' },
  intended: '[data-n19-later], footer a[href*="tiktok.com"]',
  later: /^(?:AI [\w ]+|[\w ]+ AI|All Canva AI|Canva AI[\w ]*|Canva Code|Magic (?:Write|Animate|Layers|Insights|Formulas|Media|Design|Studio)|Text to speech voiceover|Image enhancer|Marketing and AI|Visual Suite|Dream Lab|Canva Sheets|Canva Docs)$/i,
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
  const NAV_NAMES = { Design: 'Templates', Product: 'Features', Education: 'Learn', Plans: 'Pro' };
  const header2019 = () => {
    for (const button of document.querySelectorAll('header nav li > button')) {
      const text = button.textContent.trim();
      if (/^(Business|Help)$/.test(text)) { if (!button.closest('li').hasAttribute('data-n19-later')) button.closest('li').setAttribute('data-n19-later', ''); continue; }
      if (!NAV_NAMES[text]) continue;
      net19.rename(button, text, NAV_NAMES[text]);
    }
  };
  const fix = () => {
    header2019();
    for (const tab of document.querySelectorAll('main [role="tab"]')) if (tab.textContent.trim() === 'AI' && !tab.hasAttribute('data-n19-later')) tab.setAttribute('data-n19-later', '');
    const h1 = document.querySelector('#root main h1');
    const hero = h1?.closest('.theme');
    if (hero && location.pathname === '/' && !hero.hasAttribute('data-n19-hero') && !document.querySelector('[data-n19-hero]')) hero.setAttribute('data-n19-hero', '');
    const box = h1?.parentElement;
    if (!box) return;
    const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) if (/\bAI-powered\s+/i.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/\bAI-powered\s+/gi, '');
  };
  const later = net19.watch(fix, { childList: true, subtree: true, characterData: true });
})();
