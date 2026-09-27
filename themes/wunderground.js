globalThis.net19Theme = {
  home: () => location.pathname === '/' || !!document.querySelector('.homepage-mast'),
  detect: () => globalThis.net19Theme.home() ? 'dark' : 'light',
  only: () => globalThis.net19Theme.home() ? 'dark' : undefined,
};
