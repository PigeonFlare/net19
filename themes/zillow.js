globalThis.net19Theme = {};
(() => {
  const words = { 'Get a mortgage': 'Home Loans', 'Find an agent': 'Agent finder', 'Manage rentals': 'List your rental', 'Get help': 'Help' };
  const fix = () => {
    for (const span of document.querySelectorAll('.znav-links li > a > span')) {
      const node = span.firstChild;
      const text = node?.nodeType === 3 ? node.textContent.trim() : '';
      if (words[text]) node.textContent = words[text] + ' ';
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
