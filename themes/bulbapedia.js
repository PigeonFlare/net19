// net19 handmade theme: Bulbapedia, 2019. Neither BulbaVector nor MonoBook has a dark theme of its own; MediaWiki's
// night preference class is followed in case the site adds one. On a dark device palette.js flips the page.
globalThis.net19Theme = {
  detect: () => document.documentElement.classList.contains('skin-theme-clientpref-night') ? 'dark' : 'light',
  watch: ['class'],
};
