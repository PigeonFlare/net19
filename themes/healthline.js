globalThis.net19Theme = {
  intended: '[data-n19-later], nav[aria-label*="more in" i], a:has(img[alt*="AACI" i])',
  later: /^(?:medical news today|greatist|psych central|bezzy|medical affairs|content integrity|sitemap|advertise with us|licensing requests|product reviews|medications|resources|visit our youtube page|@trust, aacci certified logo|@trust, aaci certified logo)$/i,
};
(() => {
  const words = { 'Health Conditions': 'Health Topics' };
  const fix = () => {
    for (const el of document.querySelectorAll('#site-header [role="menuitem"]')) {
      net19.rename(el, words);
    }
    for (const list of document.querySelectorAll('[role="tablist"]')) if (/^Top Reads/.test(list.textContent.trim()) && !list.hasAttribute('data-n19-later')) list.setAttribute('data-n19-later', '');
  };
  const later = net19.watch(fix);
})();
(() => {
  const mark = () => document.documentElement.toggleAttribute('data-net19-home', location.pathname === '/');
  mark();
  addEventListener('popstate', mark);
  let last = location.pathname;
  const check = () => { if (location.pathname !== last) { last = location.pathname; mark(); } };
  const start = () => new MutationObserver(net19.frame(check)).observe(document.body, { childList: true });
  net19.onBody(start);
})();
