// net19 handmade theme: Spotify. The web player marks its dark theme with html.encore-dark-theme (it is always dark
// today); spotify.com's marketing pages are light. The palette map moves today's bright green back to 2019's #1db954.
globalThis.net19Theme = {
  detect: () => document.documentElement.classList.contains('encore-dark-theme') ? 'dark' : 'light',
  watch: ['class'],
  // The web player was dark-only in 2019 too, so it is never flipped to light; the marketing pages follow the device.
  only: () => document.documentElement.classList.contains('encore-dark-theme') ? 'dark' : undefined,
  light: { '#1ed760': '#1db954' },
  dark: { '#1ed760': '#1db954' },
};
// support.spotify.com: "What can I help with?" (the 2025 assistant prompt) reads "Search" again.
(() => {
  if (location.hostname !== 'support.spotify.com') return;
  const fix = () => { for (const f of document.querySelectorAll('[class*="EntryPoint_textareaWrapper"] textarea')) if (f.placeholder !== 'Search') f.placeholder = 'Search'; };
  const start = () => { fix(); new MutationObserver(fix).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['placeholder'] }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
