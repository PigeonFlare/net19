globalThis.net19Theme = {
  later: /^(?:visit weather\.com|the weather channel|the weather company|weather data apis|go ad free)$/i,
  home: () => location.pathname === '/' || !!document.querySelector('.homepage-mast'),
  detect: () => globalThis.net19Theme.home() ? 'dark' : 'light',
  only: () => globalThis.net19Theme.home() ? 'dark' : undefined,
};
