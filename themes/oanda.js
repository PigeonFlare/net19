globalThis.net19Theme = { intended: '[data-n19-quick]' };
(() => {
  const mark = () => {
    for (const b of document.querySelectorAll('.card-currency_converter_row button')) {
      if (!b.hasAttribute('data-n19-quick') && /^[A-Z]{3}$/.test(b.textContent.trim()) && !b.closest('[role="listbox"], [role="dialog"]')) {
        b.setAttribute('data-n19-quick', '');
        const row = b.parentElement;
        if (row && [...row.children].every(c => /^[A-Z]{3}$/.test(c.textContent.trim()))) row.setAttribute('data-n19-quick', '');
      }
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; mark(); }); };
  const start = () => { mark(); new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true }); };
  start();
})();
