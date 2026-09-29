globalThis.net19Theme = {
  detect() {
    const t = document.body?.getAttribute('data-duet-theme') || '';
    if (/dark/i.test(t)) return 'dark';
    if (/light/i.test(t)) return 'light';
    return null;
  },
  watch: ['class', 'data-duet-theme'],
  scopes: ['body', '.duet--article--lede', '.duet--navigation--footer', 'aside[id^="popover-"]'],
  light: {
    '#5200ff': '#e2127a', '#3cffd0': '#e2127a', '#eee6ff': '#efeff0', '#131313': '#222222', '#4a4a4a': '#424242', '#636363': '#6a6a6a',
    '#e9e9e9': '#e7e7e8',
  },
  dark: {
    '#3cffd0': '#f0368f', '#5200ff': '#393092', '#131313': '#000000', '#313131': '#333333', '#949494': '#9a9a9a',
  },
  later: /^(?:follow(?:follow)?(?: [\w&' -]{1,30})?|following|unfollow|gift this article|gift|open notifications|notifications|verge subscription|subscribe to the verge)$/i,
  keepLabels: /^(?:latest)$/i,
  intended: 'nav[aria-label="Top Navigation"] li:has(> a[href$="/policy"]), footer nav[aria-label="PMC network sites"], #zephr-zone-footer, #zephr-overlay, [role="tablist"]:has(> #storyStream-tab)',
};
