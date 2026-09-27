// net19 handmade theme: namu.wiki, 2019 ("senkawa"). namu.wiki keeps its own dark mode: body.theseed-dark-mode when
// set, body.theseed-light-mode when forced light, otherwise it follows the device.
globalThis.net19Theme = {
  detect: () => {
    const body = document.body;
    if (body?.classList.contains('theseed-dark-mode')) return 'dark';
    if (body?.classList.contains('theseed-light-mode')) return 'light';
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },
  watch: ['class'],
};
