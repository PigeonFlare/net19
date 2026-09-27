// net19 handmade theme: telegram.org, 2019. telegram.org still serves its 2019 layout and stylesheet (telegram.css);
// the 2025 restyle and its dark mode live in a separate sheet, telegram-theme.css, which is switched off here through
// its media attribute (as net19 does with subreddit sheets), so the 2019 stylesheet draws the page. The page is then
// always drawn light, as it was in 2019; on a dark device palette.js flips it.
globalThis.net19Theme = (() => {
  const RESTYLE = 'link[rel="stylesheet"][href*="/css/telegram-theme.css"]';
  const off = link => { if (link.media !== 'not all') { link.dataset.n19Media = link.media || ''; link.media = 'not all'; } };
  const sweep = () => document.querySelectorAll(RESTYLE).forEach(off);
  sweep();
  // The sheet is in <head>: catch it as it is parsed, before anything is painted.
  const early = new MutationObserver(sweep);
  early.observe(document.documentElement, { childList: true, subtree: true });
  addEventListener('DOMContentLoaded', () => { sweep(); early.disconnect(); }, { once: true });
  return { detect: () => 'light', watch: ['data-theme', 'class'] };
})();
// Header wording as in 2019: "Twitter" (not "Follow on X"), and "Protocol" where the 2024 "Safety" tab is.
(() => {
  const fix = () => {
    for (const a of document.querySelectorAll('.navbar-twitter > a')) {
      for (const node of a.childNodes) if (node.nodeType === 3 && /Follow on X/.test(node.textContent)) node.textContent = ' Twitter';
    }
    for (const a of document.querySelectorAll('.navbar-tg .navbar-nav > li > a[href$="telegram.org/safety"], .navbar-tg .navbar-nav > li > a[href="/safety"]')) {
      if (a.childElementCount === 0 && a.textContent.trim() === 'Safety') { a.textContent = 'Protocol'; a.setAttribute('href', 'https://core.telegram.org/mtproto'); }
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fix, { once: true }); else fix();
})();
