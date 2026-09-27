// net19 handmade theme: Twitch in 2019, light and dark. Twitch marks its dark theme with html.tw-root--theme-dark.
// Small DOM fixes bring back the 2019 page: "Discover" and "Try Prime" (with Twitch's own crown icon) around Browse, the
// side bar's "Recommended Channels" heading (signed out) instead of "Live Channels", "Recommended live channels" as the
// first front-page shelf, the "Join the Twitch community!" box under the carousel in place of the fixed sign-up bar
// (hidden by its text), and no hype-train line on side-bar cards.
globalThis.net19Theme = {
  detect: () => document.documentElement.classList.contains('tw-root--theme-dark') ? 'dark' : 'light',
  watch: ['class'],
  // Post-2019 entry points, by label: stories (2024), the discovery and clips feeds (2023–24), Guest Star (2022),
  // Hype Chat (2023).
  later: /^(?:stories|create a story|view stories|discovery feed|try the discovery feed|clips feed|watch clips feed|shorts|guest star|request to join|hype chat|send a hype chat)$/i,
};
(() => {
  // A copy of the Browse item with another label and link (Discover before it, Try Prime after it)
  const copyOf = (item, label, href) => {
    const copy = item.cloneNode(true);
    const a = copy.querySelector('a');
    if (!a) return null;
    a.href = href; a.setAttribute('aria-label', label); a.setAttribute('data-net19-link', ''); a.removeAttribute('data-a-target'); a.removeAttribute('data-test-selector');
    a.removeAttribute('aria-current'); a.classList.remove('active');
    for (const p of a.querySelectorAll('p')) p.textContent = label;
    for (const d of a.querySelectorAll('[aria-label]')) d.setAttribute('aria-label', label);
    copy.setAttribute('data-net19-link', '');
    return copy;
  };
  const links = () => {
    const browse = document.querySelector('nav.top-nav a[data-a-target="browse-link"]');
    const item = browse?.parentElement;
    if (!item) return;
    const added = item.parentElement.querySelector('a[data-net19-prime]');
    if (added) {
      // The crown may render after the links were added
      const crown = !added.querySelector('[data-net19-prime-icon]') && document.querySelector('nav.top-nav [data-a-target="prime-offers-icon"] svg');
      if (crown) { const icon = document.createElement('span'); icon.setAttribute('data-net19-prime-icon', ''); icon.append(crown.cloneNode(true)); added.prepend(icon); }
      return;
    }
    if (item.parentElement.querySelector('[data-net19-link]')) return;
    const discover = copyOf(item, 'Discover', '/');
    const prime = copyOf(item, 'Try Prime', 'https://gaming.amazon.com/');
    if (!discover || !prime) return;
    // Try Prime carries Twitch's own crown icon, taken from its Prime offers button
    const pa = prime.querySelector('a'), crown = document.querySelector('nav.top-nav [data-a-target="prime-offers-icon"] svg');
    pa.setAttribute('data-net19-prime', '');
    if (crown) { const icon = document.createElement('span'); icon.setAttribute('data-net19-prime-icon', ''); icon.append(crown.cloneNode(true)); pa.prepend(icon); }
    item.before(discover); item.after(prime);
  };
  // The sign-up bar pinned to the bottom became a box on the front page, under the carousel, in 2019's manner
  const join = () => {
    const main = document.querySelector('#front-page-main-content');
    const box = main?.querySelector(':scope > [data-net19-join]');
    const signup = document.querySelector('nav.top-nav [data-a-target="signup-button"]');
    if (!main || !signup) { box?.remove(); return; }
    const bar = [...document.querySelectorAll('.tw-callout-message')].find(c => /Join the Twitch community/i.test(c.textContent || ''));
    if (box) {
      // Twitch's own "coolcat" picture from the bar, which may render after the box
      const img = !box.querySelector('img') && bar?.querySelector('img');
      if (img?.src) { const i = document.createElement('img'); i.src = img.src; i.alt = ''; box.prepend(i); }
      return;
    }
    const div = document.createElement('div');
    div.setAttribute('data-net19-join', '');
    const img = bar?.querySelector('img');
    if (img?.src) { const i = document.createElement('img'); i.src = img.src; i.alt = ''; div.append(i); }
    const text = document.createElement('div'), title = document.createElement('strong'), sub = document.createElement('span');
    title.textContent = 'Join the Twitch community!';
    sub.textContent = 'Discover the best live streams anywhere.';
    text.append(title, sub);
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = 'Sign Up';
    button.addEventListener('click', () => document.querySelector('nav.top-nav [data-a-target="signup-button"]')?.click());
    div.append(text, button);
    main.prepend(div);
  };
  const fix = () => {
    for (const callout of document.querySelectorAll('.tw-callout-message')) {
      const bar = callout.closest('article');
      if (bar && !bar.hasAttribute('data-net19-hidden') && /Join the Twitch community/i.test(callout.textContent || '')) bar.setAttribute('data-net19-hidden', '');
    }
    for (const h of document.querySelectorAll('.side-nav-header h2, .side-nav-header h3')) {
      if (!h.children.length && h.textContent.trim() === 'Live Channels') h.textContent = 'Recommended Channels';
    }
    for (const card of document.querySelectorAll('.side-nav-card')) {
      for (const p of card.querySelectorAll('p, span')) {
        if (!p.hasAttribute('data-net19-hidden') && /^(?:Shared |Community )?(?:Hype|Mythic|Community|Golden Kappa|Treasure) Train\b/.test(p.textContent.trim())) {
          const row = p.parentElement;
          (row && !row.querySelector('[data-a-target="side-nav-title"], [data-a-target="side-nav-card-metadata"], img') ? row : p).setAttribute('data-net19-hidden', '');
        }
      }
    }
    // The content-classification notice ("May Contain Labeled Content", 2023) on category and channel pages
    for (const p of document.querySelectorAll('p, h2, h3, strong, span')) {
      if (p.children.length || !/^May Contain Labeled Content$/i.test(p.textContent.trim())) continue;
      let box = p.parentElement;
      while (box && box !== document.body && !box.querySelector('button')) box = box.parentElement;
      if (!box || box === document.body || box.textContent.length >= 400) continue;
      // The notice's card frame (an article with a shadow) wraps only the notice: it goes with it.
      while (box.parentElement && box.parentElement.children.length === 1 && box.parentElement.textContent.length < 400 && !/^(SECTION|MAIN|BODY)$/.test(box.parentElement.tagName)) box = box.parentElement;
      if (!box.hasAttribute('data-net19-hidden')) box.setAttribute('data-net19-hidden', '');
    }
    // The first front-page shelf was "Recommended live channels"
    for (const a of document.querySelectorAll('#front-page-main-content h2 > a[href="/directory/all"]')) {
      if (!a.children.length && a.textContent.trim() === 'Live on Twitch') a.textContent = 'Recommended live channels';
    }
    links();
    join();
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
