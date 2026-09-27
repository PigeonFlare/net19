globalThis.net19Theme = {
  detect: () => document.documentElement.classList.contains('skin-theme-clientpref-night') ? 'dark' : 'light',
  watch: ['class'],
};
