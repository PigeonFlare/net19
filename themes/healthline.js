globalThis.net19Theme = {
  intended: '[data-n19-later], nav[aria-label*="more in" i], a:has(img[alt*="AACI" i])',
  later: /^(?:medical news today|greatist|psych central|bezzy|medical affairs|content integrity|sitemap|advertise with us|product reviews|medications|resources|visit our youtube page|@trust, aacci certified logo|@trust, aaci certified logo)$/i,
};
(() => {
  const words = { 'Health Conditions': 'Health Topics' };
  const fix = () => {
    for (const el of document.querySelectorAll('#site-header [role="menuitem"]')) {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) if (words[n.textContent.trim()]) n.textContent = n.textContent.replace(n.textContent.trim(), words[n.textContent.trim()]);
    }
    for (const list of document.querySelectorAll('[role="tablist"]')) if (/^Top Reads/.test(list.textContent.trim()) && !list.hasAttribute('data-n19-later')) list.setAttribute('data-n19-later', '');
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else new MutationObserver((_, o) => { if (document.body) { o.disconnect(); start(); } }).observe(document.documentElement, { childList: true });
})();
(() => {
  const mark = () => document.documentElement.toggleAttribute('data-net19-home', location.pathname === '/');
  mark();
  addEventListener('popstate', mark);
  let last = location.pathname;
  const check = () => { if (location.pathname !== last) { last = location.pathname; mark(); } };
  const start = () => new MutationObserver(() => requestAnimationFrame(check)).observe(document.body, { childList: true });
  if (document.body) start(); else new MutationObserver((_, o) => { if (document.body) { o.disconnect(); start(); } }).observe(document.documentElement, { childList: true });
})();
