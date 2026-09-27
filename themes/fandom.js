// net19 handmade theme: Fandom. FandomDesktop marks a wiki's theme with body.theme-fandomdesktop-dark / -light.
globalThis.net19Theme = {
  detect: () => document.body?.classList.contains('theme-fandomdesktop-dark') ? 'dark' : 'light',
  watch: ['class'],
  // Fandom's 2021 brand purple (headings, accents, hover links) back to the 2019 dark teal-navy and aqua
  light: { '#520044': '#002a32', '#b80099': '#00a8a8' },
};
// The wiki's own 2019 Oasis art. Every wiki uploaded its Oasis wordmark as File:Wiki-wordmark.png and its header art as
// File:Community-header-background; MediaWiki stores them under fixed hashed paths (8/89 and 0/0e), and Fandom still
// serves them. When they load, the wordmark replaces the community logo and the art goes on the header band; a wiki
// without them keeps what it shows today.
(() => {
  const root = document.documentElement;
  const remember = (key, value) => { try { if (value === undefined) return localStorage.getItem(key); localStorage.setItem(key, value); } catch { return null; } };
  const probe = (url, done) => {
    const known = remember('n19-fd:' + url);
    if (known === 'no') return;
    if (known === 'ok') { done(); return; }
    const img = new Image();
    img.onload = () => { if (img.naturalWidth > 1) { remember('n19-fd:' + url, 'ok'); done(); } };
    img.onerror = () => remember('n19-fd:' + url, 'no');
    img.src = url;
  };
  let base = '';
  const apply = () => {
    const logo = document.querySelector('.fandom-community-header__image img');
    const source = logo?.getAttribute('src') || getComputedStyle(document.body).getPropertyValue('--theme-body-background-image');
    const m = /(https:\/\/static\.wikia\.nocookie\.net\/[^/]+\/(?:[a-z-]+\/)?images\/)/.exec(source || '');
    if (!m) return;
    if (m[1] !== base) {
      base = m[1];
      const art = base + '0/0e/Community-header-background/revision/latest';
      probe(art, () => root.style.setProperty('--n19-fd-header-art', `url("${art}")`));
    }
    if (logo && !logo.hasAttribute('data-n19-fd')) {
      logo.setAttribute('data-n19-fd', '');
      const wordmark = base + '8/89/Wiki-wordmark.png/revision/latest';
      probe(wordmark, () => { logo.src = wordmark; logo.removeAttribute('srcset'); logo.removeAttribute('width'); logo.removeAttribute('height'); });
    }
  };
  // Fandom's light logo (wds-brand-fandom-logo-light.svg) sits beside the stylesheets it serves from its versioned
  // resource path (…/resources-ucp/mw143/…), on whichever host this page loaded them from.
  const lightLogo = () => {
    const entry = performance.getEntriesByType('resource').map(e => e.name).find(n => /\/resources-ucp\/mw\d+\//.test(n));
    const prefix = entry ? entry.slice(0, entry.search(/\/resources-ucp\/mw\d+\//)) + entry.match(/\/resources-ucp\/mw\d+\//)[0] : null;
    if (!prefix) return;
    const url = prefix + 'dist/svg/wds-brand-fandom-logo-light.svg';
    const img = new Image();
    img.onload = () => { root.style.setProperty('--n19-fd-logo', `url("${url}")`); root.setAttribute('data-n19-fd-logo', ''); };
    img.src = url;
  };
  // Discussions (a script-built app) draws its community header after load: look again a few times.
  let tries = 0;
  const again = () => { apply(); if (!document.querySelector('.fandom-community-header__image img') && ++tries < 10) setTimeout(again, 1000); };
  const start = () => { again(); lightLogo(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();
