globalThis.net19Theme = {
  detect() {
    const body = document.body?.classList;
    if (!body) return 'light';
    return body.contains('theme-dark') || body.contains('theme-system') && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },
  watch: ['class'],
};
(() => {
  const relabel = (el, from, to) => { const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); for (let n = walker.nextNode(); n; n = walker.nextNode()) if (n.data.trim() === from) n.data = n.data.replace(from, to); };
  const fix = () => {
    for (const tab of document.querySelectorAll('#mainbar a[href*="tab=Bounties"]')) relabel(tab, 'Bountied', 'Featured');
    for (const link of document.querySelectorAll('footer a')) { relabel(link, 'Stack Internal', 'Teams'); relabel(link, 'Stack Ads', 'Advertising'); }
    const h1 = document.querySelector('#mainbar h1');
    if (!h1 || !/^\/questions\/?$/.test(location.pathname)) return;
    const walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) if (/^\s*Newest Questions\s*$/.test(n.data)) n.data = n.data.replace('Newest Questions', 'All Questions');
  };
  const start = () => { fix(); requestAnimationFrame(fix); setTimeout(fix, 1500); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();
