globalThis.net19Theme = {};
(() => {
  const HINT = 'Search movies, TV, actors, more...';
  const fix = () => {
    const header = document.querySelector('rt-header');
    if (!header) return;
    for (const input of header.querySelectorAll('input[slot="search-input"]')) if (input.placeholder !== HINT) input.placeholder = HINT;
    for (const a of header.querySelectorAll('ul[slot="nav-links"] a')) {
      if (/^\s*About Rotten Tomatoes®?\s*$/.test(a.textContent) && a.childElementCount === 0) a.textContent = 'What’s the Tomatometer®?';
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); keep(); }); };
  const root = document.documentElement;
  const keep = () => {
    const header = document.querySelector('#main > header, body > #main > header');
    if (header && root.hasAttribute('data-net19-flip') && !header.hasAttribute('data-net19-keep')) header.setAttribute('data-net19-keep', '');
  };
  new MutationObserver(keep).observe(root, { attributes: true, attributeFilter: ['data-net19-flip'] });
  const start = () => {
    fix(); keep();
    new MutationObserver(later).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['placeholder'] });
  };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
