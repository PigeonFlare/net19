// net19 handmade theme: AccuWeather. The site has a single (light) design; the default background-luminance
// detection keeps it light, and the dark tokens apply only if the page itself renders dark.
globalThis.net19Theme = {};
// The 2019 forecast tabs read "Daily" where today's read "10-Day".
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
