globalThis.net19Theme = { intended: '[data-n19-later]', later: /^(?:air quality|health & activities)$/i };
(() => {
  const fix = () => {
    for (const h of document.querySelectorAll('h2, h3')) {
      if (!/^(Sun & Moon|Air Quality|Around the Globe)$/.test(h.textContent.replace(/\s+/g, ' ').trim())) continue;
      const card = h.closest('.card, [class*="card"], section') || h.parentElement;
      if (card && !card.hasAttribute('data-n19-later') && card.querySelectorAll('h2').length === 1) card.setAttribute('data-n19-later', '');
    }
    for (const a of document.querySelectorAll('.subnav .subnav-item')) {
      const words = { '10-Day': 'Daily', Today: 'Now', Monthly: 'Month' };
      const node = [...a.querySelectorAll('*'), a].flatMap(e => [...e.childNodes]).find(n => n.nodeType === 3 && words[n.textContent.trim()]);
      if (node) node.textContent = node.textContent.replace(node.textContent.trim(), words[node.textContent.trim()]);
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  fix(); new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true });
})();
