// net19 handmade theme: wsj. The site follows the browser's dark setting on some pages and not others, so palette.js
// reads the mode from the page background. The article "Listen" audio button, AI "Key Points" summaries and follow
// buttons are post-2019 and are hidden by label as well. The video center (/video) was black in 2019 as it is now, so
// it stays dark on light devices instead of being inverted.
globalThis.net19Theme = {
  only: () => (/^\/video(?:\/|$)/.test(location.pathname) ? 'dark' : undefined),
  later: /^(?:listen(?: \(\d+ min(?:ute)?s?\))?|key points|show key points|what'?s this\?|follow|following|get wsj\+|wsj\+)$/i,
  keepLabels: /^(?:follow us|follow wsj)$/i,
};
