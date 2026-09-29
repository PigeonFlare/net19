globalThis.net19Theme = { intended: 'rt-header-nav-item[slot="shop"], [data-n19-app-promo]' };
(() => {
  const HINT = 'Search movies, TV, actors, more...';
  const LABELS = { 'tv shows': 'TV', showtimes: 'Tickets & Showtimes', 'login/signup': 'Sign up | Log in' };
  const RENAMES = { Popcornmeter: 'Audience Score', 'Media Info': 'Movie Info' };
  const fix = () => {
    for (const el of document.querySelectorAll('rt-text, h2, span')) {
      if (el.childElementCount) continue;
      const name = RENAMES[el.textContent.trim()];
      if (name) el.textContent = name;
    }
    const header = document.querySelector('rt-header');
    if (!header) return;
    for (const input of header.querySelectorAll('input[slot="search-input"]')) if (input.placeholder !== HINT) input.placeholder = HINT;
    for (const a of header.querySelectorAll('a[href="/about"], ul[slot="nav-links"] a')) {
      if (/^\s*About Rotten Tomatoes®?\s*$/.test(a.textContent) && a.childElementCount === 0) a.textContent = 'What’s the Tomatometer®?';
    }
    for (const el of header.querySelectorAll('rt-header-nav-item > a[slot="link"], button')) {
      const label = LABELS[el.textContent.trim().toLowerCase()];
      if (label && el.childElementCount === 0) el.textContent = label;
    }
    for (const box of document.querySelectorAll('rt-app-modal-content')) {
      const modal = box.parentElement;
      if (modal && modal !== document.body && !modal.hasAttribute('data-n19-app-promo')) modal.setAttribute('data-n19-app-promo', '');
    }
    for (const icons of document.querySelectorAll('social-media-icons')) {
      const shadow = icons.shadowRoot;
      if (shadow && !shadow.querySelector('style[data-n19-social]')) {
        const style = document.createElement('style');
        style.setAttribute('data-n19-social', '');
        style.textContent = 'a[href*="tiktok.com"], a[href*="bsky.app"], li:has(> a[href*="tiktok.com"]), li:has(> a[href*="bsky.app"]) { display: none !important; }';
        shadow.append(style);
      }
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); keep(); }); };
  const root = document.documentElement;
  const keep = () => {
    const header = document.querySelector('rt-header')?.closest('header') || document.querySelector('rt-header');
    if (header && root.hasAttribute('data-net19-flip') && !header.hasAttribute('data-net19-keep')) header.setAttribute('data-net19-keep', '');
  };
  new MutationObserver(keep).observe(root, { attributes: true, attributeFilter: ['data-net19-flip'] });
  const start = () => {
    fix(); keep();
    new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['placeholder'] });
  };
  start();
})();
