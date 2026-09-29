globalThis.net19Theme = {
  later: /^(?:nfl network|espn & nfl\+ premium bundle|where to watch|odds|nba\.com)$/i,
  intended: '[id^="taboola"], [data-n19-later]',
};
(() => {
  const EMOJI = /^[\u{1F300}-\u{1FAFF}☀-➿️\s]+/u;
  const fix = () => {
    const wtw = document.querySelector('#global-nav li.where-to-watch');
    if (wtw) { const w = wtw.offsetWidth + 'px'; if (wtw.parentElement.style.getPropertyValue('--n19-wtw') !== w) wtw.parentElement.style.setProperty('--n19-wtw', w); }
    for (const h of document.querySelectorAll('article.sub-module h2')) if (/^(Trending Now|More NBA coverage on NBA\.COM)$/i.test(h.textContent.trim())) h.closest('article.sub-module').setAttribute('data-n19-later', '');
    for (const h of document.querySelectorAll('.contentItem__header h2, .quicklinks_list__name, a.quicklinks_list__link')) for (const n of h.childNodes) if (n.nodeType === 3 && n.nodeValue.trim() === 'Andscape') n.nodeValue = n.nodeValue.replace('Andscape', 'The Undefeated');
    for (const heading of document.querySelectorAll('.quicklinks__heading, .module__header, .quicklinks_list__name, .sub-module a, .Card__Header__Title')) {
      const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
      const node = walker.nextNode();
      if (node && EMOJI.test(node.nodeValue)) node.nodeValue = node.nodeValue.replace(EMOJI, '');
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
