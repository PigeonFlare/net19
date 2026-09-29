globalThis.net19Theme = {
  intended: '#hp_app #vs_cont > .vs',
  detect: () => location.pathname === '/' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : undefined,
};
(() => {
  const fix = () => {
    const q = document.querySelector('#hp_app #sb_form_q'); if (q && q.placeholder) q.placeholder = ''; if (q && !q.getAttribute('aria-label')) q.setAttribute('aria-label', 'Enter your search term');
    const account = document.querySelector('#b_header #id_l');
    if (account && account.querySelector('#id_a[aria-label="Sign in"]') && !account.querySelector('[data-n19-signin]')) {
      const label = document.createElement('span'); label.setAttribute('data-n19-signin', ''); label.textContent = 'Sign in'; account.prepend(label);
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => {
    fix();
    new MutationObserver(later).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['placeholder'] });
  };
  net19.onBody(start);
})();
