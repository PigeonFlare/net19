globalThis.net19Theme = (() => {
  const host = location.hostname;
  const kind = /^(www\.)?line\.me$/.test(host) ? 'lp' : host === 'help.line.me' ? 'help' : 'other';
  document.documentElement.setAttribute('data-n19-line', kind);
  return {};
})();
(() => {
  if (document.documentElement.getAttribute('data-n19-line') !== 'lp') return;
  const keep = () => { const mv = document.getElementById('mvArea'); if (mv) mv.setAttribute('data-net19-keep', ''); return !!mv; };
  const start = () => { if (keep()) return; const o = new MutationObserver(() => { if (keep()) o.disconnect(); }); o.observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
