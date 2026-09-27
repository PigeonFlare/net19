// net19 handmade theme: LINE (line.me), 2019. The page type is marked on <html data-n19-line>: "lp" for line.me's own
// pages (www.line.me and line.me), "help" for help.line.me, "other" for LINE's other services, which are left as drawn.
// LINE had no dark mode in 2019 and has none now, so a dark device flips the page (read from its background).
globalThis.net19Theme = (() => {
  const host = location.hostname;
  const kind = /^(www\.)?line\.me$/.test(host) ? 'lp' : host === 'help.line.me' ? 'help' : 'other';
  document.documentElement.setAttribute('data-n19-line', kind);
  return {};
})();
// The banner's white title sits on a photograph: on a dark device the banner is kept as drawn, not flipped.
(() => {
  if (document.documentElement.getAttribute('data-n19-line') !== 'lp') return;
  const keep = () => { const mv = document.getElementById('mvArea'); if (mv) mv.setAttribute('data-net19-keep', ''); return !!mv; };
  const start = () => { if (keep()) return; const o = new MutationObserver(() => { if (keep()) o.disconnect(); }); o.observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
