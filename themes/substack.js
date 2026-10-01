globalThis.net19Theme = { later: /^(?:get (?:the )?app|download (?:the )?app|open (?:in|the) app|restack|restacks|chat|notes)$/i };
(() => {
  const run = () => {
    if (globalThis.net19Lang?.() !== 'en') return;
    const later = document.querySelector('[data-testid="maybeLater"]');
    if (!later) return;
    net19.rename(later, 'No thanks', globalThis.net19Say?.('Let me read it first') || 'Let me read it first');
  };
  net19.watch(run);
})();
