globalThis.net19Theme = {
  later: /^(?:24\/7 help|get help 24\/7|aol desktop gold|ask ai|ai summary)$/i,
};
(() => {
  const run = () => {
    if (globalThis.net19Lang?.() === 'en') for (const signin of document.querySelectorAll('header.m-AolHeader .m-profile__signin')) {
      net19.rename(signin, 'Sign in', 'Login / Join');
    }
    const button = document.querySelector('header.m-AolHeader #header-form-search-button');
    if (button && globalThis.net19Lang?.() === 'en' && !button.querySelector('[data-n19-aol]')) {
      const label = document.createElement('span');
      label.setAttribute('data-n19-aol', 'search');
      label.textContent = 'SEARCH';
      button.append(label);
    }
  };
  net19.watch(run);
})();
