globalThis.net19Theme = {
  detect: () => document.documentElement.classList.contains('__fb-dark-mode') ? 'dark' : 'light',
  watch: ['class'],
  later: /^(?:reels?|reels and short videos|watch reels|create reel|feeds|meta ai|ask meta ai|imagine(?: me| with meta ai)?|meta verified|get meta verified|professional dashboard|memories|avatars?|create (?:your )?avatar|edit avatar|avatar stickers?|comment with an avatar sticker|menu|meta quest|climate science center|ai info|made with ai)$/i,
};
(() => {
  let settled = false;
  const WORDS = new Map([['Explore the things ', 'Connect with friends and the world around you on Facebook.'], ['you love', ''],
    ['Log in', 'Log In'], ['Forgot password?', 'Forgot account?'], ['Forgot account?', 'Forgot account?'], ['Create new account', 'Sign Up'], ['Create New Account', 'Sign Up'],
    ['Email or mobile number', 'Email or Phone'], ['Email or Phone Number', 'Email or Phone'], ['Email address or phone number', 'Email or Phone']]);
  const FEATURES = [['See photos and updates', 'from friends in News Feed.'], ['Share what\u2019s new', 'in your life on your Timeline.'], ['Find more', 'of what you\u2019re looking for with Facebook Search.']];
  const mark = (el, name) => { if (el && el.getAttribute('data-n19-fb') !== name) el.setAttribute('data-n19-fb', name); };
  const words = root => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const to = WORDS.get(node.nodeValue);
      if (to !== undefined) {
        node.nodeValue = to;
        if (to.startsWith('Connect') && node.parentNode.lastChild?.nodeValue === '.') node.parentNode.lastChild.nodeValue = '';
      }
    }
  };
  const FOOT_LATER = /^(?:Meta Pay|Meta Store|Ray-Ban Meta|Meta Quest|Muse|Threads|Meta AI|Consumer Health Privacy|Privacy Center|Contact Uploading & Non-Users|Meta Verified|Voting Information Center|Climate Science Center)$/;
  const FOOT_WORDS = new Map([['Video', 'Watch'], ['Privacy Policy', 'Privacy'], ['Create ad', 'Create Ad'], ['Ad choices', 'AdChoices'], ['More languages\u2026', '+'], ['More languages...', '+']]);
  const footer = foot => {
    for (const link of foot.querySelectorAll('a')) {
      const text = link.textContent.trim();
      if (FOOT_LATER.test(globalThis.net19English(text))) { let box = link; while (box.parentElement && box.parentElement !== foot && box.parentElement.childElementCount === 1) box = box.parentElement; mark(box, 'later'); continue; }
      if (!FOOT_WORDS.has(text)) continue;
      const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) if (node.nodeValue.trim() === text) node.nodeValue = FOOT_WORDS.get(text);
      if (text.startsWith('More languages')) mark(link, 'more-languages');
    }
  };
  const landing = () => {
    const form = document.getElementById('login_form');
    if (!form || !form.querySelector('input[name="pass"]')) return;
    let row = form.parentElement;
    while (row && row !== document.body && !row.querySelector('img')) row = row.parentElement;
    if (!row || row === document.body) return;
    mark(row, 'row');
    for (const col of row.children) mark(col, col.contains(form) ? 'login' : col.querySelector('img') ? 'hero' : 'rule');
    const card = form.parentElement?.parentElement;
    if (card && row.contains(card)) {
      mark(card, 'card');
      for (const part of card.children) if (!part.contains(form)) mark(part, 'title');
    }
    const email = form.querySelector('input[name="email"]');
    const create = form.querySelector('a[href*="/reg/"]');
    let list = email?.parentElement;
    while (list && list !== form && !(create && list.contains(create))) list = list.parentElement;
    if (list && create) {
      for (const part of list.children) {
        const name = part.querySelector('input[name="email"]') ? 'f-email' : part.querySelector('input[name="pass"]') ? 'f-pass' : part.querySelector('a[href*="/reg/"]') ? 'f-create'
          : part.querySelector('a[href*="recover"]') ? 'f-forgot' : part.querySelector('[role="button"]') ? 'f-login' : '';
        if (name) mark(part, name);
      }
      if (settled && !list.querySelector('[data-n19-fb="signup-head"]')) {
        const head = document.createElement('div');
        head.setAttribute('data-n19-fb', 'signup-head');
        head.textContent = globalThis.net19Say?.('Sign Up') ?? 'Sign Up';
        const sub = document.createElement('div');
        sub.setAttribute('data-n19-fb', 'signup-sub');
        sub.textContent = 'It\u2019s quick and easy.';
        list.prepend(head, ...(globalThis.net19Lang?.() === 'en' ? [sub] : []));
      }
    }
    const hero = row.querySelector('[data-n19-fb="hero"]');
    const headline = hero && [...hero.querySelectorAll('span')].find(s => s.textContent.trim().length > 20);
    if (settled && headline && globalThis.net19Lang?.() === 'en' && !hero.querySelector('[data-n19-fb="features"]')) {
      const list = document.createElement('div');
      list.setAttribute('data-n19-fb', 'features');
      for (const [bold, rest] of FEATURES) {
        const line = document.createElement('div');
        line.setAttribute('data-n19-fb', 'feature');
        const b = document.createElement('b');
        b.textContent = bold;
        line.append(b, rest);
        list.append(line);
      }
      hero.append(list);
    }
    const main = [...document.querySelectorAll('[role="main"]')].find(m => !m.contains(form) && !row.contains(m));
    let foot = main;
    while (foot?.parentElement && !foot.parentElement.contains(row)) foot = foot.parentElement;
    if (foot?.parentElement) { mark(foot, 'foot'); mark([...foot.parentElement.children].find(c => c.contains(row)), 'top'); if (settled) footer(foot); }
    if (settled) words(row);
  };

  const TABS = /^(?:home|watch|video|reels|marketplace|groups|gaming|friends|news|feeds|pages)(?:,.*)?$/i;
  const LATER_HREF = /(?:^|\/\/[^/]*facebook\.com)\/(?:reel|reels|professional_dashboard|feeds|memories|imagine|meta_verified|metaverified|ai_studio|gaming\/play)(?:[/?]|$)|meta\.ai/i;
  const ACTIONS = /^(?:Like|Comment|Share|Send)$/;
  const inComment = el => el.closest('[role="article"][aria-label^="Comment by"], [role="article"][aria-label^="Reply by"]');
  const surface = el => { const s = getComputedStyle(el); return s.boxShadow !== 'none' || (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && parseFloat(s.borderTopLeftRadius) > 0); };
  const seen = new WeakSet();
  const app = () => {
    const banner = document.querySelector('div[role="banner"]');
    if (!!banner !== document.documentElement.hasAttribute('data-n19-bar')) document.documentElement.toggleAttribute('data-n19-bar', !!banner);
    if (banner) {
      for (const layer of banner.children) {
        const s = getComputedStyle(layer);
        if (s.position !== 'static' && s.zIndex !== 'auto' && !layer.hasAttribute('data-net19-keep')) layer.setAttribute('data-net19-keep', '');
      }
      for (const input of banner.querySelectorAll('input[type="search"], input[role="combobox"]')) {
        if (/^Search Facebook$/i.test(input.placeholder)) input.placeholder = 'Search';
      }
      const accounts = banner.querySelector('[role="navigation"][aria-label*="Account" i]');
      for (const link of banner.querySelectorAll('a[aria-label][href]')) {
        if (accounts?.contains(link) || link.getAttribute('aria-label') === 'Facebook' || !TABS.test(link.getAttribute('aria-label'))) continue;
        const item = link.closest('li') || link.parentElement;
        mark(item, 'tab');
      }
    }
    for (const unit of document.querySelectorAll('[role="feed"] > div, [data-pagelet^="FeedUnit"], [data-pagelet^="ProfileTimeline"] > div, [data-pagelet="GroupFeed"] > div, [aria-posinset]')) {
      if (seen.has(unit)) continue;
      if (!unit.offsetHeight) continue;
      seen.add(unit);
      let found = null;
      const walk = (el, depth) => {
        if (found || depth > 9) return;
        for (const child of el.children) { if (found) return; if (child.offsetWidth > 300 && surface(child)) { found = child; return; } walk(child, depth + 1); }
      };
      walk(unit, 0);
      if (found && !found.closest('[data-n19-fb="post"]')) mark(found, 'post');
      const reels = unit.querySelectorAll('a[href*="/reel/"]').length;
      const heading = unit.querySelector('h3, h2, [role="heading"]')?.textContent.trim() || '';
      if (reels >= 2 && (/^reels\b/i.test(heading) || reels >= 3)) mark(unit, 'later');
    }
    for (const button of document.querySelectorAll('[role="button"]:not([data-n19-fb])')) {
      const text = button.textContent.trim();
      if (text.length > 8 || !ACTIONS.test(text) || inComment(button)) continue;
      mark(button, 'action');
    }
    for (const span of document.querySelectorAll('[role="main"] [role="button"] span')) {
      if (!/^What.s on your mind/.test(span.textContent)) continue;
      const pill = span.closest('[role="button"]');
      if (!pill || pill.hasAttribute('data-n19-fb')) continue;
      mark(pill, 'composer');
      let card = pill.parentElement;
      while (card && card !== document.body && !card.classList.contains('xquyuld') && !(getComputedStyle(card).boxShadow !== 'none')) card = card.parentElement;
      if (card && card !== document.body) {
        mark(card, 'composer-card');
        const inner = card.firstElementChild;
        if (settled && inner && !card.querySelector('[data-n19-fb="create-head"]')) {
          const head = document.createElement('div');
          head.setAttribute('data-n19-fb', 'create-head');
          head.textContent = globalThis.net19Say?.('Create Post') ?? 'Create Post';
          inner.prepend(head);
        }
      }
    }
    if (location.pathname === '/' || location.pathname === '/home.php') {
      const feed = document.querySelector('[role="main"] [role="feed"]');
      if (feed && !feed.closest('[data-n19-fb="column"]')) {
        const main = feed.closest('[role="main"]');
        let col = feed;
        for (let up = feed.parentElement; up && up !== main && Math.abs(up.offsetWidth - feed.offsetWidth) < 3; up = up.parentElement) col = up;
        if (col.offsetWidth >= 490 && col.offsetWidth <= 760) mark(col, 'column');
      }
    }
    for (const row of document.querySelectorAll(':is([data-pagelet="LeftRail"], [data-pagelet="LeftNav"], [role="navigation"][aria-label="Shortcuts"]) :is(a[href], a[role="link"], [role="button"]):not([data-n19-fb])')) {
      const icon = row.querySelector('img, i[data-visualcompletion="css-img"], i[style*="background-image"], svg');
      if (!icon || !row.textContent.trim() || row.offsetHeight < 30 || row.offsetWidth < 220 || row.closest('[data-n19-fb="navrow"]')) continue;
      const first = row.firstElementChild?.firstElementChild;
      if (!first || !first.contains(icon)) continue;
      mark(row, 'navrow');
      mark(first, 'navicon-box');
      const size = icon.getBoundingClientRect();
      if (size.width >= 30 && size.height >= 30) mark(icon, 'navicon-big');
      for (let up = icon.parentElement; up && up !== first.parentElement; up = up.parentElement) {
        const s = getComputedStyle(up);
        const c = s.backgroundColor.match(/[\d.]+/g)?.map(Number);
        if (s.borderRadius.startsWith('50%') && c && (c[3] ?? 1) > 0) { mark(up, Math.max(c[0], c[1], c[2]) - Math.min(c[0], c[1], c[2]) > 60 ? 'navicon-dot' : 'navicon-circle'); break; }
      }
    }
    for (const link of document.querySelectorAll(':is([data-pagelet="LeftRail"], [role="navigation"], [role="complementary"], div[role="banner"]) a[href]')) {
      if (!LATER_HREF.test(link.getAttribute('href'))) continue;
      mark(link.closest('li') || link, 'later');
    }
  };
  let queued = 0, last = 0;
  const run = () => { queued = 0; last = performance.now(); if (location.pathname === '/' || location.pathname.startsWith('/login')) landing(); app(); };
  const settle = () => setTimeout(() => { settled = true; later(); }, 1200);
  if (document.readyState === 'complete') settle(); else addEventListener('load', settle, { once: true });
  const later = () => { if (queued) return; queued = setTimeout(() => requestAnimationFrame(run), Math.max(0, 300 - (performance.now() - last))); };
  const start = () => {
    run();
    new MutationObserver(later).observe(document.body, { childList: true, subtree: true });
  };
  if (document.body) start(); else new MutationObserver((_, o) => { if (document.body) { o.disconnect(); start(); } }).observe(document.documentElement, { childList: true });
})();
(() => {
  if (!/^\/help\b/.test(location.pathname)) return;
  const fix = () => {
    for (const input of document.querySelectorAll('input[type="search"], input[placeholder="Search" i], textarea[placeholder="Search" i]')) {
      for (let e = input.parentElement, i = 0; e && i < 5; e = e.parentElement, i++) {
        if (parseFloat(getComputedStyle(e).borderTopLeftRadius) >= 16) { if (!e.hasAttribute('data-n19-fb-search')) e.setAttribute('data-n19-fb-search', ''); break; }
      }
    }
    for (const note of document.querySelectorAll('span, div')) {
      if (note.childElementCount > 3 || note.hasAttribute('data-net19-hidden')) continue;
      const t = note.textContent.trim();
      if (/^By using this service, you agree to Meta.s AI terms\b/.test(t) && t.length < 200) note.setAttribute('data-net19-hidden', '');
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; setTimeout(() => { queued = false; fix(); }, 300); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else new MutationObserver((_, o) => { if (document.body) { o.disconnect(); start(); } }).observe(document.documentElement, { childList: true });
})();
