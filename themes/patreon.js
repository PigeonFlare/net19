globalThis.net19Theme = {
  detect: () => {
    const classes = document.documentElement.className || '';
    if (/token-modes-module[^ ]*colorDark/.test(classes)) return 'dark';
    if (/token-modes-module[^ ]*colorLight/.test(classes)) return 'light';
    const followsDevice = /token-modes-module[^ ]*colorAuto|\blenis\b/.test(classes) || !!document.getElementById('__next');
    if (followsDevice) return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return null;
  },
  later: /^(?:chats?|open chats?|give a gift|gift a membership)$/i,
};
