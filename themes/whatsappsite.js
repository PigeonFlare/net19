// net19 handmade theme: WhatsApp's site (www / blog / faq.whatsapp.com), 2019. The current site paints most of its
// surfaces with generated class names rather than design variables, so the colors the 2024 design introduced are
// found by their computed value and marked on the element once (data-n19-wa-bg / -ink / -type): the cream page
// (#fcf5eb) and mint panels (#e6ffda) go back to 2019's white and pale teal, the near-black bands (#111b21) to 2019's
// navy (#273443), today's green text to 2019's teal, and display type to 2019's light weight. The site header and
// footer are marked as data-n19-wa-part="head" | "foot" and kept as drawn on a dark device (a teal band and a navy
// footer already suit a dark page; the Features menu inside the header is flipped again by palette.js). The help center (faq) is re-pointed through its design
// variables instead (palette.js). There is no dark mode on these sites: a dark device flips the page.
globalThis.net19Theme = (() => {
  const host = location.hostname;
  const site = host.startsWith('faq.') ? 'faq' : host.startsWith('blog.') ? 'blog' : 'www';
  document.documentElement.setAttribute('data-n19-wa', site);
  return {
    // Help center: the Meta design variables it is drawn from (2025 greens) to 2019's teal
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
      // White type laid over a photograph (the home page's hero card) is kept as drawn when a dark device flips the page.
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
    // Styles that arrive after the first pass (late stylesheets) are read again once the page has loaded.
    addEventListener('load', () => { for (const el of document.querySelectorAll('[data-n19-wa-seen]:not([data-n19-wa-bg]):not([data-n19-wa-ink])')) el.removeAttribute('data-n19-wa-seen'); parts(); mark(document.body); }, { once: true });
  };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
