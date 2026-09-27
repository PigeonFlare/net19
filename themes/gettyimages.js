globalThis.net19Theme = { later: /^AI Solutions$/i };
(() => {
  const fix = () => {
    const home = location.pathname === '/' || /^\/[a-z]{2}(-[a-z]{2})?\/?$/i.test(location.pathname);
    if (document.documentElement.hasAttribute('data-n19-home') !== home) document.documentElement.toggleAttribute('data-n19-home', home);
    if (!home) return;
    const h1 = document.querySelector('.site-width > div > div > div > div > h1');
    if (h1 && h1.textContent.trim() !== 'Moving the world with images' && /^Amazing imagery/i.test(h1.textContent.trim())) h1.textContent = 'Moving the world with images';
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  fix(); new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true });
})();
