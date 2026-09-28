globalThis.net19Theme = {
  detect: () => document.documentElement.classList.contains('encore-dark-theme') ? 'dark' : 'light',
  watch: ['class'],
  only: () => document.documentElement.classList.contains('encore-dark-theme') ? 'dark' : undefined,
  light: { '#1ed760': '#1db954' },
  dark: { '#1ed760': '#1db954' },
  later: /^(?:import your music|audiobooks access|audiobooks|show now playing view|music videos|profiles)$/i,
};
(() => {
  if (location.hostname !== 'support.spotify.com') return;
  const fix = () => { for (const f of document.querySelectorAll('[class*="EntryPoint_textareaWrapper"] textarea')) if (f.placeholder !== 'Search') f.placeholder = 'Search'; };
  const start = () => { fix(); new MutationObserver(fix).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['placeholder'] }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
(() => {
  if (location.hostname !== 'open.spotify.com') return;
  const fix = () => {
    for (const b of document.querySelectorAll('[data-testid="action-bar-row"] [data-testid="play-button"]')) {
      const inner = b.firstElementChild;
      if (!inner) continue;
      const word = (b.getAttribute('aria-label') || '').split(' ')[0] || 'Play';
      let tag = inner.querySelector(':scope > .n19-play');
      if (!tag) { tag = document.createElement('span'); tag.className = 'n19-play'; inner.append(tag); }
      if (tag.textContent !== word) tag.textContent = word;
    }
  };
  const start = () => { fix(); new MutationObserver(fix).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-label'] }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
