globalThis.net19Theme = {
  intended: '[data-n19-later]',
  detect() {
    const root = document.documentElement.classList;
    if (root.contains('theme-dark')) return 'dark';
    if (root.contains('theme-light')) return 'light';
    return undefined;
  },
  watch: ['class'],
  later: /^(?:3D|AI data licensing|AI tools|Search Assistant|AI image generator|AI generator)$/i,
};
(() => {
  const H1 = 'Stock assets to power your creativity';
  const SUB = 'Explore over 270 million royalty-free images, stock footage clips, and music tracks.';
  const fix = () => {
    const hero = document.querySelector('section[data-automation="UniversalHomeHero"]');
    const h1 = hero?.querySelector('h1');
    if (h1 && h1.textContent !== H1) h1.textContent = H1;
    const p = h1?.nextElementSibling;
    if (p?.tagName === 'P' && p.textContent !== SUB) p.textContent = SUB;
    for (const tab of document.querySelectorAll('[role="tab"]')) if (/^(Templates|Sound effects)$/i.test(tab.textContent.trim()) && !tab.hasAttribute('data-n19-later')) tab.setAttribute('data-n19-later', '');
    if (hero) for (const h2 of document.querySelectorAll('#main-content h2')) {
      if (!/\bAI\b/.test(h2.textContent)) continue;
      const box = h2.closest('#main-content .theme-light, #main-content section');
      if (box && !box.hasAttribute('data-net19-later-section')) box.setAttribute('data-net19-later-section', '');
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true }); };
  start();
})();
