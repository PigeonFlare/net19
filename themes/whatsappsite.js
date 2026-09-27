globalThis.net19Theme = (() => {
  const host = location.hostname;
  const site = host.startsWith('faq.') ? 'faq' : host.startsWith('blog.') ? 'blog' : 'www';
  document.documentElement.setAttribute('data-n19-wa', site);
  return {
    light: site === 'faq' ? { '#1B8755': '#1cb39b', '#128C7E': '#1ebea5', '#02A698': '#1cb39b', '#25D366': '#01e675' } : {},
    dark: site === 'faq' ? { '#1B8755': '#1cb39b', '#128C7E': '#1ebea5', '#02A698': '#1cb39b', '#25D366': '#01e675' } : {},
    later: /^(?:meta ai|channels|whatsapp plus|ask meta ai)$/i,
  };
})();
(() => {
  if (document.documentElement.getAttribute('data-n19-wa') === 'faq') return;
  const BG = { 'rgb(252, 245, 235)': 'cream', 'rgb(17, 27, 33)': 'dark', 'rgb(230, 255, 218)': 'mint', 'rgb(11, 20, 26)': 'dark' };
  const INK = { 'rgb(37, 211, 102)': 'green', 'rgb(67, 205, 102)': 'green', 'rgb(0, 168, 132)': 'green', 'rgb(16, 57, 40)': 'deep', 'rgb(0, 128, 105)': 'green' };
  const mark = scope => {
    for (const el of [scope, ...scope.querySelectorAll('*')]) {
      if (el.namespaceURI !== 'http://www.w3.org/1999/xhtml' || el.hasAttribute('data-n19-wa-seen')) continue;
      el.setAttribute('data-n19-wa-seen', '');
      const cs = getComputedStyle(el);
      const bg = BG[cs.backgroundColor]; if (bg) el.setAttribute('data-n19-wa-bg', bg);
      const ink = INK[cs.color]; if (ink && !el.closest('a[class*="_9u4i"]')) el.setAttribute('data-n19-wa-ink', ink);
      if (parseFloat(cs.fontSize) >= 30 && el.childElementCount < 4) el.setAttribute('data-n19-wa-type', 'display');
      if (el.matches('#content-wrapper ._ain8')) el.setAttribute('data-net19-keep', '');
    }
  };
  const parts = () => {
    const head = document.querySelector('header');
    if (head && !head.hasAttribute('data-n19-wa-part') && head.querySelector('a[href*="faq.whatsapp.com"], a[href$="/privacy"], a[href*="/download"]')) { head.setAttribute('data-n19-wa-part', 'head'); head.setAttribute('data-net19-keep', ''); }
    const foot = document.querySelector('footer');
    if (foot && !foot.hasAttribute('data-n19-wa-part')) { foot.setAttribute('data-n19-wa-part', 'foot'); foot.setAttribute('data-net19-keep', ''); }
  };
  let pending = new Set(), queued = false;
  const flush = () => { queued = false; parts(); const list = [...pending]; pending = new Set(); for (const n of list) if (n.isConnected) mark(n); };
  const start = () => {
    parts(); mark(document.body);
    new MutationObserver(records => {
      for (const r of records) for (const n of r.addedNodes) if (n.nodeType === 1) pending.add(n);
      if (pending.size && !queued) { queued = true; setTimeout(flush, 120); }
    }).observe(document.body, { childList: true, subtree: true });
    addEventListener('load', () => { for (const el of document.querySelectorAll('[data-n19-wa-seen]:not([data-n19-wa-bg]):not([data-n19-wa-ink])')) el.removeAttribute('data-n19-wa-seen'); parts(); mark(document.body); }, { once: true });
  };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
