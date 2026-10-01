globalThis.net19Theme = {
  detect() {
    const body = document.body?.classList;
    if (!body) return 'light';
    return body.contains('theme-dark') || body.contains('theme-system') && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },
  watch: ['class'],
};
(() => {
  const relabel = net19.rename;
  const fix = () => {
    for (const tab of document.querySelectorAll('#mainbar a[href*="tab=Bounties"]')) relabel(tab, 'Bountied', 'Featured');
    for (const link of document.querySelectorAll('footer a')) { relabel(link, 'Stack Internal', 'Teams'); relabel(link, 'Stack Ads', 'Advertising'); }
    const h1 = document.querySelector('#mainbar h1');
    if (!h1 || !/^\/questions\/?$/.test(location.pathname)) return;
    net19.rename(h1, 'Newest Questions', 'All Questions');
  };
  const start = () => { fix(); requestAnimationFrame(fix); setTimeout(fix, 1500); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();
