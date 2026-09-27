globalThis.net19Theme = {
  detect: () => {
    const list = document.documentElement.classList;
    if (list.contains('theme-light')) return 'light';
    if (list.contains('theme-dark') || list.contains('theme-darker') || list.contains('theme-midnight')) return 'dark';
    return document.documentElement.hasAttribute('data-wf-site') ? 'light' : null;
  },
  watch: ['class'],
  only: () => /^\/(?:login|register|invite\/|gift\/|reset|verify|activate|oauth2\/authorize)/.test(location.pathname) ? 'dark' : undefined,
  later: /^(?:quests?|shop|discover|explore discoverable servers|start an activity|activities|apps|use apps|create poll|create thread|add super reaction|super reactions?|summaries|forward|server guide|browse channels|channels & roles|open gif picker|open sticker picker|record voice message|send voice message|set a server tag|server tags?|avatar decorations?|nameplates?|profile effects?)$/i,
};
(() => {
  if (!/^\/(?:$|download|nitro|safety|company|blog|careers|developers|servers|community)/.test(location.pathname)) return;
  const LATER = /^(?:discover|quests)$/i;
  const fix = () => {
    for (const title of document.querySelectorAll('.nav_menu .menu-title, .nav_dd .menu-title, .nav_burger .menu-title')) {
      if (!LATER.test(title.textContent.trim())) continue;
      const item = title.closest('li, .nav_dd');
      if (item && !item.hasAttribute('data-net19-hidden')) item.setAttribute('data-net19-hidden', '');
    }
    for (const band of document.querySelectorAll('.home--hero, .discord_banner')) if (!band.hasAttribute('data-net19-keep')) band.setAttribute('data-net19-keep', '');
  };
  const start = () => {
    fix();
    new MutationObserver(fix).observe(document.body, { childList: true, subtree: true });
    new MutationObserver(() => requestAnimationFrame(fix)).observe(document.documentElement, { attributes: true, attributeFilter: ['data-net19-flip'] });
  };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
