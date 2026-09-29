globalThis.net19Theme = {
  detect: () => {
    const root = document.documentElement;
    if (root.classList.contains('uds-color-mode-dark')) return 'dark';
    const scheme = root.getAttribute('data-color-scheme') || root.getAttribute('theme');
    if (scheme === 'dark' || scheme === 'light') return scheme;
    return scheme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },
  watch: ['class', 'theme', 'data-color-scheme'],
  intended: '[data-n19-later]',
  later: /^(?:return to homepage|add us on google|add yahoo on google|powered by yahoo scout|alphaspace|get finance plus|get fantasy plus|try fantasy plus|try finance plus|ask yahoo|yahoo scout|ai answer|ai summary|get the yahoo app|download the yahoo app)$/i,
};
(() => {
  if (location.hostname === 'finance.yahoo.com') document.documentElement.setAttribute('data-n19-yf', '');
  const hideAskAI = () => {
    for (const el of document.querySelectorAll('[data-testid="dock"] :is(button, [role="tab"], [role="radio"], label, a)')) {
      if ((el.textContent || '').trim() !== 'Ask AI' || el.closest('[data-n19-yf-hide]')) continue;
      const group = el.closest('[role="tablist"], [role="radiogroup"]') || el.parentElement;
      group.setAttribute('data-n19-yf-hide', '');
    }
  };
  const LATER_MODULES = /^(From Our Shopping Experts|Spotlight Videos|Yahoo Games|Popular Games|Explore AI results with Yahoo Scout|The Yodel|Up next)$/;
  const mark = el => { if (el && !el.hasAttribute('data-n19-later')) el.setAttribute('data-n19-later', ''); };
  const topWithin = (el, limit) => { let top = el; for (let n = el.parentElement; n && n !== document.body && !n.matches('aside, main, #strm, #web, #right, #nca-homepage'); n = n.parentElement) { if ((n.textContent || '').length > limit) break; top = n; } return top; };
  const markLater = () => {
    for (const h of document.querySelectorAll('#strm > ul > li :is(h2, h3, h4), #web li :is(h2, h3, span, div), #right-rail :is(h2, h3), aside :is(h2, h3, h4)')) {
      if (h.children.length > 2 || !LATER_MODULES.test((h.textContent || '').trim())) continue;
      mark(h.closest('#strm > ul > li, #web > ol > li, #web ol > li') || topWithin(h, 700));
    }
    for (const el of document.querySelectorAll('#games-cta, #strm > ul > li:has(#vertical-video), #strm > ul > li:has([aria-label="Game categories"])')) mark(el);
    for (const form of document.querySelectorAll('form[aria-label="Newsletter sign up form"]')) mark(topWithin(form, 700));
    for (const button of document.querySelectorAll('button[aria-label="Large Cards"]')) mark(topWithin(button, 40));
    for (const pause of document.querySelectorAll('#ntk button[aria-label="Pause"], #ntk button[aria-label="Play"]')) mark(pause);
    for (const span of document.querySelectorAll('#module-uh span, #sf-root span, [role="listbox"] span')) if (/^Explore AI results/.test((span.textContent || '').trim())) mark(span.closest('li, [role="option"], button, a') || span);
    for (const close of document.querySelectorAll('button[aria-label="Close tooltip"]')) if (/Switch views/.test(close.parentElement?.textContent || '')) mark(close.parentElement);
    for (const h of document.querySelectorAll('main[aria-label^="Top stories"] h2')) if ((h.textContent || '').trim() === 'For You') mark(h);
  };
  const fix = () => {
    if (location.hostname === 'finance.yahoo.com') hideAskAI();
    const field = document.getElementById('uh-sbq');
    if (field && field.placeholder) field.placeholder = '';
    const title = document.querySelector('#trending-search header h2');
    if (title && title.textContent === 'Trending') title.textContent = 'Trending Now';
    markLater();
    for (const box of document.querySelectorAll('body#ysch #right ol:not([data-net19-scout])')) {
      if (/Yahoo Scout/.test(box.textContent || '')) box.setAttribute('data-net19-scout', '');
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
