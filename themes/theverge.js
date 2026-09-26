// net19 handmade theme: The Verge, 2019. The site keeps its own light/dark choice as body[data-duet-theme]
// ("vergeLight" / "vergeDark", following the device by default); both are styled. The design system lives in custom
// properties on <body>'s theme class, so body is scanned and overridden too: the 2022 blurple (#5200ff) and mint
// (#3cffd0) accents go back to 2019's magenta and purple.
globalThis.net19Theme = {
  detect() {
    const t = document.body?.getAttribute('data-duet-theme') || '';
    if (/dark/i.test(t)) return 'dark';
    if (/light/i.test(t)) return 'light';
    return null;
  },
  watch: ['class', 'data-duet-theme'],
  // Some parts carry their own copy of a theme class (the article lede, popovers, the footer): scanned too.
  scopes: ['body', '.duet--article--lede', '.duet--navigation--footer', 'aside[id^="popover-"]'],
  light: {
    '#5200ff': '#e2127a', '#3cffd0': '#e2127a', '#eee6ff': '#efeff0', '#131313': '#222222', '#4a4a4a': '#424242', '#636363': '#6a6a6a',
    '#e9e9e9': '#e7e7e8',
  },
  dark: {
    '#3cffd0': '#f0368f', '#5200ff': '#393092', '#131313': '#000000', '#313131': '#333333', '#949494': '#9a9a9a',
  },
  // Follow buttons and "Following" feeds (2022), gift links (2023), notifications, the AI section link.
  later: /^(?:follow(?:follow)?(?: [\w&' -]{1,30})?|following|unfollow|gift this article|gift|open notifications|notifications|verge subscription|subscribe to the verge)$/i,
  keepLabels: /^(?:latest)$/i,
};
