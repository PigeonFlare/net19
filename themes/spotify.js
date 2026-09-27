globalThis.net19Theme = {
  detect: () => document.documentElement.classList.contains('encore-dark-theme') ? 'dark' : 'light',
  watch: ['class'],
  only: () => document.documentElement.classList.contains('encore-dark-theme') ? 'dark' : undefined,
  light: { '#1ed760': '#1db954' },
  dark: { '#1ed760': '#1db954' },
};
(() => {
  if (location.hostname !== 'support.spotify.com') return;
  const fix = () => { for (const f of document.querySelectorAll('[class*="EntryPoint_textareaWrapper"] textarea')) if (f.placeholder !== 'Search') f.placeholder = 'Search'; };
  const start = () => { fix(); new MutationObserver(fix).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['placeholder'] }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
