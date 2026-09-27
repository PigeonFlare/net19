globalThis.net19Theme = (() => {
  const device = matchMedia('(prefers-color-scheme: dark)');
  const home = () => !!document.querySelector('.main-content > .banner > .banner__bd');
  return { detect: () => home() ? (device.matches ? 'dark' : 'light') : undefined };
})();
