// net19 handmade theme: WeChat (wechat.com), 2019. The rebuilt 2019 home page is a dark photograph in both modes (as
// it was in 2019), so it is never flipped: it reports the device's own mode. Every other page (Contact Us, Terms, the
// help center) is a white page with no dark mode of its own and is read from its background, so a dark device flips it.
globalThis.net19Theme = (() => {
  const device = matchMedia('(prefers-color-scheme: dark)');
  const home = () => !!document.querySelector('.main-content > .banner > .banner__bd');
  return { detect: () => home() ? (device.matches ? 'dark' : 'light') : undefined };
})();
