globalThis.net19Theme = {};
(() => {
  const fix = () => {
    for (const a of document.querySelectorAll('.subnav .subnav-item')) {
      const node = [...a.querySelectorAll('*'), a].flatMap(e => [...e.childNodes]).find(n => n.nodeType === 3 && n.textContent.trim() === '10-Day');
      if (node) node.textContent = node.textContent.replace('10-Day', 'Daily');
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  fix(); new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true });
})();
