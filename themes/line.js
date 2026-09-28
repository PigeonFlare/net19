globalThis.net19Theme = (() => {
  const host = location.hostname;
  const kind = /^(www\.)?line\.me$/.test(host) ? 'lp' : host === 'help.line.me' ? 'help' : 'other';
  document.documentElement.setAttribute('data-n19-line', kind);
  return kind === 'lp' ? { detect: () => 'light' } : {};
})();
(() => {
  if (document.documentElement.getAttribute('data-n19-line') !== 'lp') return;
  const keep = () => { const mv = document.getElementById('mvArea'); if (mv) mv.setAttribute('data-net19-keep', ''); return !!mv; };
  const start = () => { if (keep()) return; const o = new MutationObserver(() => { if (keep()) o.disconnect(); }); o.observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
(() => {
  if (document.documentElement.getAttribute('data-n19-line') !== 'lp') return;
  const WORDS = new Map([['Messenger APP', 'Download'], ['Services', 'Family Apps']]);
  const FILTERS = /^(All Product|Communication|Entertainment|Lifestyle|Shopping|Fintech|Business|News|Game)$/;
  const fix = () => {
    const filters = [...document.querySelectorAll('main button')].filter(b => FILTERS.test(b.textContent.trim()));
    if (filters.length >= 4) {
      let list = filters[0].parentElement;
      while (list && !filters.every(f => list.contains(f))) list = list.parentElement;
      if (list && list.tagName !== 'MAIN' && !list.hasAttribute('data-net19-hidden')) list.setAttribute('data-net19-hidden', '');
    }
    for (const link of document.querySelectorAll('body > header ul.headerMenu > li > a')) {
      const text = link.textContent.trim();
      if (/^Life on LINE$/i.test(text)) { const item = link.closest('li'); if (!item.hasAttribute('data-net19-hidden')) item.setAttribute('data-net19-hidden', ''); continue; }
      const to = WORDS.get(text);
      if (!to) continue;
      const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) if (node.nodeValue.trim() === text) node.nodeValue = to;
    }
  };
  const start = () => { fix(); new MutationObserver(() => requestAnimationFrame(fix)).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
