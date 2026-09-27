globalThis.net19Theme = {
  only: () => (/^\/video(?:\/|$)/.test(location.pathname) ? 'dark' : undefined),
  later: /^(?:listen(?: \(\d+ min(?:ute)?s?\))?|key points|show key points|what'?s this\?|follow|following|get wsj\+|wsj\+)$/i,
  keepLabels: /^(?:follow us|follow wsj)$/i,
};
