globalThis.net19Theme = {
  detect: () => /(^|\s)theme--dark/.test(document.documentElement.className + ' ' + (document.body?.className || '')) ? 'dark' : 'light',
  watch: ['class'],
  later: /^(?:rewrite with ai|write with ai|draft with ai|improve with ai|polish with ai|start a post, try writing with ai|get ai-powered insights|ai-powered insights|premium ai insights|see ai insights|games|play games|today's puzzles|today’s puzzles|subscribe|send in a private message)$/i,
};
(() => {
  const WELCOME = 'Welcome to your professional community';
  const welcome = () => {
    const h1 = document.querySelector('main#main-content > section:first-child h1');
    if (!h1 || h1.children.length) return;
    const node = [...h1.childNodes].find(n => n.nodeType === 3 && n.nodeValue.trim());
    if (node && node.nodeValue.trim() !== WELCOME) node.nodeValue = WELCOME;
  };
  const repost = () => {
    for (const span of document.querySelectorAll('.feed-shared-social-action-bar button span, .social-action-bar__button-text, .social-reshare-button span')) {
      if (span.children.length) continue;
      if (span.textContent.trim() === 'Repost') span.textContent = 'Share';
    }
  };
  const LATER_SECTIONS = /^(Explore top LinkedIn content|Discover the best software tools|Keep your mind sharp with games|Let the right people know you.re open to work|Explore collaborative articles|Top Content)$/i;
  const LATER_LINKS = /^(Services|Products|Top Companies|Top Startups|Top Colleges|Posts|Articles|Schools|News|News Letters|Newsletters|Advice|People Search|Accessibility|Your California Privacy Choices|Games|Top Content|Collaborative Articles|Services Marketplace)$/i;
  const guest = () => {
    if (document.querySelector('#global-nav, header.global-nav')) return;
    for (const heading of document.querySelectorAll('main#main-content > :is(section, div) h2')) {
      const block = heading.closest('main#main-content > :is(section, div)');
      if (block && LATER_SECTIONS.test(heading.textContent.trim()) && !block.hasAttribute('data-net19-hidden')) block.setAttribute('data-net19-hidden', '');
    }
    for (const heading of document.querySelectorAll('main section > h2, main section > div > h2')) {
      if (!/^Products$/.test(heading.textContent.trim())) continue;
      const block = heading.closest('section');
      if (block && !block.hasAttribute('data-net19-hidden')) block.setAttribute('data-net19-hidden', '');
    }
    for (const puzzle of document.querySelectorAll('main a[href*="/games/"]')) {
      const block = puzzle.closest('section') || puzzle.closest('li') || puzzle;
      if (!block.hasAttribute('data-net19-hidden')) block.setAttribute('data-net19-hidden', '');
    }
    for (const button of document.querySelectorAll('button, [role="button"], a')) {
      const label = (button.getAttribute('aria-label') || button.textContent).replace(/\s+/g, ' ').trim();
      if (/^(Sign in with Apple|Continue with Apple|Continue with google|Sign in with Google|Sign in with Email|View C2PA information|Where are the filters\?)$/i.test(label) && !button.hasAttribute('data-net19-hidden')) button.setAttribute('data-net19-hidden', '');
    }
    for (const link of document.querySelectorAll('main#main-content section.directory a, footer a')) {
      if (!LATER_LINKS.test(link.textContent.trim())) continue;
      const item = link.closest('li') || link;
      if (!item.hasAttribute('data-net19-hidden')) item.setAttribute('data-net19-hidden', '');
    }
  };
  const mark = (el, name) => { if (el && el.getAttribute('data-n19-li') !== name) el.setAttribute('data-n19-li', name); };
  const hide = el => { if (el && !el.hasAttribute('data-net19-hidden')) el.setAttribute('data-net19-hidden', ''); };
  const WORDS = new Map([['Repost', 'Share'], ['Unlock Premium for $0', 'Try Premium Free for 1 Month'], ['For Business', 'Work'], ['Write article', 'Write an article']]);
  const LATER_RAIL = /^(Newsletters|Accessibility|Today.s puzzles|Games|Send|Premium features|Try Premium for .*)$/i;
  const checked = new WeakSet();
  const opaque = style => { const c = style.backgroundColor.match(/[\d.]+/g)?.map(Number); return c && (c[3] ?? 1) > .9; };
  const app = () => {
    const search = document.querySelector('header input[placeholder]');
    const bar = search?.closest('header');
    if (!bar) return;
    document.documentElement.setAttribute('data-n19-li-app', '');
    mark(bar, 'bar');
    let band = bar;
    while (band.parentElement && band.parentElement !== document.body && band.parentElement.offsetHeight <= bar.offsetHeight + 2) band = band.parentElement;
    if (band !== bar) mark(band, 'band');
    for (const layer of bar.querySelectorAll('div')) if (layer.offsetWidth >= bar.offsetWidth - 4 && !layer.hasAttribute('data-n19-li') && opaque(getComputedStyle(layer))) mark(layer, 'band');
    mark(search, 'search');
    if (settled && search.placeholder !== 'Search') search.placeholder = 'Search';
    for (const item of bar.querySelectorAll('a[aria-label], button[aria-label], a[href]')) mark(item, 'navitem');
    const main = document.querySelector('main');
    if (!main) return;
    for (const el of main.querySelectorAll('div, section, article, aside')) {
      if (checked.has(el) || el.hasAttribute('data-n19-li') || el.offsetWidth < 180 || el.offsetHeight < 40) continue;
      checked.add(el);
      const style = getComputedStyle(el);
      if (parseFloat(style.borderTopLeftRadius) >= 6 && opaque(style) && (style.boxShadow !== 'none' || style.borderTopStyle !== 'none')) mark(el, 'card');
    }
    for (const button of main.querySelectorAll('button, a[role="button"], [role="button"]')) {
      if (checked.has(button) || button.hasAttribute('data-n19-li') || !button.offsetWidth) continue;
      checked.add(button);
      const style = getComputedStyle(button);
      if (parseFloat(style.borderTopLeftRadius) >= 12 && button.offsetHeight <= 48) mark(button, 'pill');
    }
    for (const link of main.querySelectorAll('a[href*="/newsletters"]')) hide(link.closest('li') || link);
    const games = [...main.querySelectorAll('a[href*="/games/"]')];
    if (games.length) {
      let box = games[0];
      while (box.parentElement && box.parentElement !== main && !games.every(g => box.contains(g))) box = box.parentElement;
      while (box.parentElement && box.parentElement !== main && !box.parentElement.querySelector('a[href*="/news/"], [aria-label*="News" i]') && box.parentElement.querySelectorAll('a').length <= games.length + 3) box = box.parentElement;
      hide(box);
    }
    for (const control of main.querySelectorAll('button, a')) {
      const text = (control.getAttribute('aria-label') || control.textContent).replace(/\s+/g, ' ').trim();
      if (LATER_RAIL.test(text) || /^Send in a private message/i.test(text)) hide(control.closest('li') || control);
    }
    if (settled) for (const root of [bar, ...main.querySelectorAll('button, a')]) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const to = WORDS.get(node.nodeValue.trim());
        if (to) node.nodeValue = to;
      }
    }
  };
  let queued = false, settled = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; repost(); guest(); app(); }); };
  const settle = () => setTimeout(() => { settled = true; later(); }, 1500);
  if (document.readyState === 'complete') settle(); else addEventListener('load', settle, { once: true });
  const start = () => {
    if (location.pathname === '/' && !document.querySelector('.global-nav, #global-nav')) { welcome(); requestAnimationFrame(welcome); }
    repost();
    guest();
    app();
    new MutationObserver(later).observe(document.body, { childList: true, subtree: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();
