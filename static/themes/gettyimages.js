// net19 handmade theme: gettyimages. Getty Images has a single (light) design; if it ever renders dark, the
// palette engine detects that from the page background and the dark tokens apply.
globalThis.net19Theme = { later: /^AI Solutions$/i };
// 2019 wording: the home hero said "Moving the world with images". The home page is marked for the stylesheet, whose
// hero rules must not reach the titles of search, detail and other pages.
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
