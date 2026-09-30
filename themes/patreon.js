globalThis.net19Theme = {
  detect: () => {
    const classes = document.documentElement.className || '';
    if (/token-modes-module[^ ]*colorDark/.test(classes)) return 'dark';
    if (/token-modes-module[^ ]*colorLight/.test(classes)) return 'light';
    const followsDevice = /token-modes-module[^ ]*colorAuto|\blenis\b/.test(classes) || !!document.getElementById('__next');
    if (followsDevice) return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return null;
  },
  later: /^(?:chats?|open chats?|give a gift|gift a membership|updates|where real community thrives|grow your community|support for your business|earning made easy|start a membership|set up a shop|newsroom|mobile|brand assets & guidelines|get it on google play|download on the app store|youtube|linkedin)$/i,
};
