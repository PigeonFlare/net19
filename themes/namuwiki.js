globalThis.net19Theme = {
  intended: 'footer a[href*="play.google.com"], footer a[href*="apps.apple.com"]',
  detect: () => {
    const body = document.body;
    if (body?.classList.contains('theseed-dark-mode')) return 'dark';
    if (body?.classList.contains('theseed-light-mode')) return 'light';
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },
  watch: ['class'],
};
