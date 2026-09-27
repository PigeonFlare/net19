// net19 handmade theme: TV Tropes, 2019. The site's own dark theme ("Night Vision", as in 2019) is a class on the
// <i id="user-prefs"> marker at the top of <body>, set from the night-vision cookie for guests. It is mirrored onto
// <html data-n19-tvt-night> so palette.js sees it change.
(() => {
  const root = document.documentElement;
  const night = () => !!document.getElementById('user-prefs')?.classList.contains('night-vision') || /(?:^|;\s*)night-vision=true/.test(document.cookie);
  const mirror = () => { const on = night(); if (root.hasAttribute('data-n19-tvt-night') !== on) root.toggleAttribute('data-n19-tvt-night', on); };
  globalThis.net19Theme = { detect: () => (mirror(), night() ? 'dark' : 'light'), watch: ['data-n19-tvt-night'] };

  // The 2019 header read Tropes, Media, Browse, Indexes, Forums, Videos. Reviews and Popular took the places of Browse
  // and Indexes; both pages still exist, so the two links are pointed back at them. In the phone menu the two new
  // entries are hidden (Browse and Indexes are already listed there).
  const RESTORE = { '/pmwiki/review_activity.php': ['/pmwiki/browse.php', 'Browse'], '/pmwiki/popular-pages.php': ['/pmwiki/index_report.php', 'Indexes'] };
  const fix = () => {
    mirror();
    for (const a of document.querySelectorAll('#main-header-nav > a')) {
      const to = RESTORE[a.getAttribute('href')];
      if (to && !a.children.length) { a.setAttribute('href', to[0]); a.textContent = to[1]; }
    }
    for (const a of document.querySelectorAll('#mobile-menu .nav-wrapper > a.xl')) {
      if (RESTORE[a.getAttribute('href')] && !a.hasAttribute('data-net19-hidden')) a.setAttribute('data-net19-hidden', '');
    }
    // Home page: the "Latest Reviews" heading (a link to review_activity.php) and the table right after it
    for (const link of document.querySelectorAll('#main-content a.float-right[href$="review_activity.php"]')) {
      const head = link.parentElement;
      if (!head || head.hasAttribute('data-n19-tvt-later') || !/^\s*Latest Reviews/.test(head.textContent)) continue;
      head.setAttribute('data-n19-tvt-later', '');
      const table = head.nextElementSibling;
      if (table && table.querySelectorAll('tr').length <= 12 && !table.matches('#main-content, #main-entry, .article-content')) table.setAttribute('data-n19-tvt-later', '');
    }
  };
  const ready = () => {
    fix();
    const prefs = document.getElementById('user-prefs');
    if (prefs) new MutationObserver(mirror).observe(prefs, { attributes: true, attributeFilter: ['class'] });
  };
  const start = () => {
    fix();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true }); else ready();
  };
  if (document.body) start(); else new MutationObserver((_, o) => { if (document.body) { o.disconnect(); start(); } }).observe(root, { childList: true });
})();
