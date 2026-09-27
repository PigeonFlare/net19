globalThis.net19Theme = (() => {
  const RESTYLE = 'link[rel="stylesheet"][href*="/css/telegram-theme.css"]';
  const off = link => { if (link.media !== 'not all') { link.dataset.n19Media = link.media || ''; link.media = 'not all'; } };
  const sweep = () => document.querySelectorAll(RESTYLE).forEach(off);
  sweep();
  const early = new MutationObserver(sweep);
  early.observe(document.documentElement, { childList: true, subtree: true });
  addEventListener('DOMContentLoaded', () => { sweep(); early.disconnect(); }, { once: true });
  return { detect: () => 'light', watch: ['data-theme', 'class'] };
})();
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
