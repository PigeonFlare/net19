globalThis.net19Theme = { later: /^(?:get (?:the )?app|download (?:the )?app|open (?:in|the) app|restack|restacks|chat|notes)$/i };
(() => {
  const run = () => {
    if (globalThis.net19Lang?.() !== 'en') return;
    const later = document.querySelector('[data-testid="maybeLater"]');
    if (!later) return;
    const walker = document.createTreeWalker(later, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) if (n.data.trim() === 'No thanks') { n.data = n.data.replace('No thanks', globalThis.net19Say?.('Let me read it first') || 'Let me read it first'); break; }
  };
  net19.watch(run);
})();
