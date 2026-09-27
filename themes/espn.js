globalThis.net19Theme = {};
(() => {
  const EMOJI = /^[\u{1F300}-\u{1FAFF}☀-➿️\s]+/u;
  const fix = () => {
    const wtw = document.querySelector('#global-nav li.where-to-watch');
    if (wtw) { const w = wtw.offsetWidth + 'px'; if (wtw.parentElement.style.getPropertyValue('--n19-wtw') !== w) wtw.parentElement.style.setProperty('--n19-wtw', w); }
    for (const heading of document.querySelectorAll('.quicklinks__heading, .module__header')) {
      const node = heading.firstChild;
      if (node && node.nodeType === 3 && EMOJI.test(node.nodeValue)) node.nodeValue = node.nodeValue.replace(EMOJI, '');
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
