globalThis.net19Theme = {
  detect: () => location.pathname === '/' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : undefined,
};
(() => {
  const fix = () => { const q = document.querySelector('#hp_app #sb_form_q'); if (q && q.placeholder) q.placeholder = ''; };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => {
    fix();
    new MutationObserver(later).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['placeholder'] });
  };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
