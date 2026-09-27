globalThis.net19Theme = {};
(() => {
  const fix = () => {
    const hero = document.getElementById('superheroSection');
    if (!hero) return false;
    const h1 = hero.querySelector('h1');
    if (h1 && /^\s*Kelley Knows Cars\.?\s*$/.test(h1.textContent)) h1.textContent = 'Car Shopping Made Easy';
    const sub = h1?.nextElementSibling;
    if (sub?.tagName === 'H2' && /values to repairs/i.test(sub.textContent)) sub.textContent = 'KBB.com is your one-stop resource';
    return !!h1;
  };
  let queued = false, observer = null;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => {
    fix();
    observer = new MutationObserver(later);
    observer.observe(document.body, { childList: true, subtree: true });
  };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
