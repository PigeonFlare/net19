globalThis.net19Theme = {
  later: /^(?:ask redfin|redfin ai)$/i,
};
(() => {
  const run = () => {
    for (const header of document.querySelectorAll('header.LargeHeader, header.SmallHeader')) {
      const svg = [...header.querySelectorAll('svg')].find(s => { const r = s.getBoundingClientRect(); return r.width > 80 && r.height > 20 && r.left < 200; });
      const holder = svg?.parentElement;
      if (holder && holder !== header && holder.getAttribute('data-n19-rf') !== 'logo') holder.setAttribute('data-n19-rf', 'logo');
    }
    if (globalThis.net19Lang?.() === 'en') for (const cta of document.querySelectorAll('.combinedLoginLinkWrapper .bp-Button.headerMenuButton')) {
      net19.rename(cta, 'Join / Sign in', 'Sign Up');
    }
  };
  net19.watch(run);
})();
