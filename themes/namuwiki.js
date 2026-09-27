globalThis.net19Theme = {
  detect: () => {
    const body = document.body;
    if (body?.classList.contains('theseed-dark-mode')) return 'dark';
    if (body?.classList.contains('theseed-light-mode')) return 'light';
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },
  watch: ['class'],
};
