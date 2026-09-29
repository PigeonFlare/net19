globalThis.net19Theme = {
  detect() {
    const classes = document.documentElement.classList;
    if (classes.contains('__ig-dark-mode') || classes.contains('__fb-dark-mode')) return 'dark';
    if (classes.contains('__ig-light-mode') || classes.contains('__fb-light-mode')) return 'light';
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },
  watch: ['class'],
  later: /^(?:reels|threads|meta ai|ask meta ai|shop|create|new post|notes?|your note|leave a note|broadcast channels?|channels|subscribe|subscriptions?|meta verified|also from meta|remix|use template|use audio|original audio|edited|suggested reels)$/i,
  keepLabels: /^(?:create new account|sign up|log in)$/i,
};
(() => {
  const mark = (el, name) => { if (el && el.getAttribute('data-n19-ig') !== name) el.setAttribute('data-n19-ig', name); };

  const landing = () => {
    const form = document.querySelector('form#login_form');
    if (!form || !form.isConnected) return;
    const picture = form.closest('body')?.querySelector('img');
    let row = form.parentElement;
    while (row && row !== document.body && !(picture && row.contains(picture) && row.children.length >= 2)) row = row.parentElement;
    if (row && row !== document.body) {
      mark(row, 'row-login');
      const [left, rule, right] = row.children;
      if (row.children.length === 3) { mark(left, 'left'); mark(rule, 'rule'); mark(right, 'right'); }
      for (let page = row.parentElement; page && page !== document.body; page = page.parentElement) {
        if (page.parentElement?.id?.startsWith('mount_')) { mark(page, 'page'); break; }
      }
      const headline = left?.querySelector('span span')?.parentElement;
      if (headline && !headline.querySelector('img')) mark(headline, 'headline');
    }
    for (let b = form.parentElement; b && b !== row; b = b.parentElement) {
      if (b.previousElementSibling || b.parentElement?.children.length > 1) { mark(b.parentElement, 'box'); break; }
    }
    const buttons = form.querySelectorAll('[role="button"]');
    mark(buttons[0], 'login');
    if (buttons[1]) mark(buttons[1], 'facebook');
    mark(form.querySelector('a[href*="/accounts/emailsignup"]'), 'signup');
    mark(form.querySelector('a[href*="/accounts/password/reset"]'), 'forgot');
    const meta = form.querySelector('svg[aria-label="Meta logo"]') || document.querySelector('[data-n19-ig="right"] svg[aria-label="Meta logo"]');
    mark(meta?.parentElement, 'meta');
  };

  const LATER_ICONS = ['Reels', 'Threads', 'New post', 'Meta AI', 'Also from Meta', 'Shop', 'Notes', 'Broadcast channel', 'Channels', 'Messenger', 'Direct', 'Messages', 'Settings'];
  const topBar = rail => {
    const logo = rail.querySelector('a[href="/"] svg[aria-label="Instagram"]')?.closest('a');
    const nav = rail.querySelector('svg[aria-label="Home"]')?.closest('a');
    if (!logo || !nav) return;
    let inner = logo.parentElement;
    while (inner && inner !== rail && !inner.contains(nav)) inner = inner.parentElement;
    if (!inner || inner === rail) return;
    mark(inner, 'barrow');
    for (const block of inner.children) mark(block, block.contains(logo) ? 'barlogo' : block.contains(nav) ? 'baricons' : 'barmore');
    for (const up of [...rail.querySelectorAll('div')].filter(d => d.contains(inner) && d !== inner)) mark(up, 'barwrap');
    for (const link of rail.querySelectorAll('a')) {
      const label = link.querySelector('svg[aria-label]')?.getAttribute('aria-label') || '';
      let item = link;
      while (item.parentElement && !item.parentElement.hasAttribute('data-n19-ig') && item.parentElement.childElementCount === 1) item = item.parentElement;
      if (/^Home$/.test(label)) mark(item, 'later');
      else if (/^Search$/.test(label)) { mark(item, 'barsearch'); mark(link, 'barsearch-link'); }
      else if (/^(Notifications|Explore)$/.test(label) || link.querySelector('img')) mark(item, 'baricon');
    }
    compass(rail);
  };
  const compass = rail => {
    if (rail.querySelector('a[data-n19-explore], svg[aria-label="Explore"]')) return;
    const bell = rail.querySelector('svg[aria-label="Notifications"]')?.closest('[data-n19-ig="baricon"]');
    if (!bell) return;
    const link = document.createElement('a');
    link.href = '/explore/';
    link.setAttribute('data-n19-explore', '');
    link.setAttribute('data-n19-ig', 'baricon');
    link.setAttribute('aria-label', 'Explore');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linejoin', 'round');
    const ring = document.createElementNS(svg.namespaceURI, 'circle');
    ring.setAttribute('cx', '12'); ring.setAttribute('cy', '12'); ring.setAttribute('r', '10.5');
    const needle = document.createElementNS(svg.namespaceURI, 'path');
    needle.setAttribute('d', 'M15.9 8.1 10.3 10.3 8.1 15.9 13.7 13.7Z');
    svg.append(ring, needle);
    link.append(svg);
    bell.before(link);
  };
  const barSearch = () => {
    const item = document.querySelector('[data-n19-ig="barsearch"]');
    const link = item?.querySelector('[data-n19-ig="barsearch-link"]');
    if (!item || !link || item === link || item.querySelector('[data-n19-ig="barsearch-box"]')) return;
    const word = globalThis.net19Say?.('Search') ?? 'Search';
    const box = document.createElement('label');
    box.setAttribute('data-n19-ig', 'barsearch-box');
    const icon = link.querySelector('svg')?.cloneNode(true);
    if (icon) { icon.removeAttribute('aria-label'); icon.setAttribute('aria-hidden', 'true'); icon.setAttribute('data-n19-ig', 'barsearch-icon'); box.append(icon); }
    const input = document.createElement('input');
    input.type = 'text';
    input.autocomplete = 'off';
    input.placeholder = word;
    input.setAttribute('aria-label', word);
    input.setAttribute('data-n19-ig', 'barsearch-input');
    input.addEventListener('keydown', event => {
      const query = input.value.trim();
      if (event.key === 'Enter' && query) location.assign(`/explore/search/keyword/?q=${encodeURIComponent(query)}`);
      if (event.key === 'Escape') { input.value = ''; input.blur(); }
    });
    box.append(input);
    item.append(box);
  };
  const feedLayout = () => {
    const main = document.querySelector('main');
    const article = main?.querySelector('article');
    const card = [...document.querySelectorAll('main [role="button"], main button')].find(b => b.textContent.trim() === 'Switch');
    if (!main || !article || location.pathname !== '/') return;
    const row = [...main.children].find(c => c.contains(article));
    if (!row) return;
    mark(row, 'feedrow');
    const [left, right] = row.children;
    if (left?.contains(article)) mark(left, 'feedleft');
    if (right && !right.contains(article)) {
      mark(right, 'feedright');
      let column = card;
      while (column && column !== right && !column.querySelector('a[href="/explore/people/"], a[href*="about.instagram.com"]')) column = column.parentElement;
      if (column && column !== right) {
        mark(column, 'railcol');
        mark([...column.children].find(child => child.querySelector('a[href="/explore/people/"]')), 'suggest');
      }
      if (card) mark(card, 'later');
    }
    const story = main.querySelector('[aria-label^="Story by"]');
    const tray = story?.closest('[role="presentation"]');
    if (tray && left) {
      let box = tray;
      while (box.parentElement && box.parentElement !== left && !box.parentElement.contains(article)) box = box.parentElement;
      mark(box, 'stories');
      mark(tray, 'storylist');
      if (settled && !box.querySelector('[data-n19-ig="stories-head"]')) {
        const head = document.createElement('div');
        head.setAttribute('data-n19-ig', 'stories-head');
        head.textContent = globalThis.net19Say?.('Stories') ?? 'Stories';
        box.prepend(head);
      }
    }
    for (const dock of document.querySelectorAll('div, button')) {
      if (dock.hasAttribute('data-n19-ig') || !/^Messages/.test(dock.textContent.trim()) || dock.textContent.length > 200) continue;
      const s = getComputedStyle(dock);
      if (s.position === 'fixed' && dock.getBoundingClientRect().bottom > innerHeight - 120) { mark(dock, 'later'); break; }
    }
    for (const follow of main.querySelectorAll('article [role="button"], article button')) {
      if (follow.textContent.trim() === 'Follow' && follow.closest('article')?.querySelector('header, a[href^="/"]') && !follow.hasAttribute('data-n19-ig')) mark(follow, 'later');
    }
  };
  const profileHeader = () => {
    const header = document.querySelector('main header');
    const name = header?.querySelector('h2')?.closest('a, div');
    if (!header || !name) return;
    mark(header, 'profhead');
    const actions = [...header.children].find(section => !section.querySelector('h2, img, [role="menu"]') && (section.querySelector('a[href="/accounts/edit/"]') || [...section.querySelectorAll('[role="button"], button')].some(b => /^(Follow|Following|Requested|Message|Follow Back)$/.test(b.textContent.trim()))));
    if (actions) mark(actions, 'profbuttons');
    for (const link of header.querySelectorAll('a[href^="/archive/"], a[href^="/direct/"]')) mark(link.parentElement?.childElementCount === 1 ? link.parentElement : link, 'later');
    for (const button of header.querySelectorAll('[role="button"]')) {
      const text = button.textContent.trim();
      if (/^(Note\.\.\.|Message)$/.test(text)) mark(button, 'later');
    }
    const newHighlight = [...header.querySelectorAll('[role="menu"] *')].find(e => e.childElementCount && e.textContent.trim() === 'New' && e.getBoundingClientRect().width < 140);
    if (newHighlight) mark(newHighlight.closest('li') || newHighlight, 'later');
    mark(header.querySelector('svg[aria-label="Options"]')?.closest('[role="button"]'), 'options');
    const edit = header.querySelector('a[href="/accounts/edit/"]');
    if (edit && settled) for (const node of edit.querySelectorAll('span, div')) if (node.childElementCount === 0 && node.textContent === 'Edit profile') node.textContent = 'Edit Profile';
    if (!actions && settled && document.querySelector('a[href^="/accounts/login"]') && !header.querySelector('[data-n19-ig="follow"]')) {
      const follow = document.createElement('a');
      follow.setAttribute('data-n19-ig', 'follow');
      follow.href = `/accounts/login/?next=${encodeURIComponent(location.pathname)}`;
      follow.textContent = 'Follow';
      const options = header.querySelector('svg[aria-label="Options"]')?.closest('[role="button"]');
      let slot = options;
      while (slot && slot.parentElement && !slot.parentElement.contains(name)) slot = slot.parentElement;
      if (slot && slot.parentElement) slot.before(follow); else name.after(follow);
    }
    if (!actions) return;
    const head = header.getBoundingClientRect(), box = name.getBoundingClientRect();
    const left = `${Math.round(box.right - head.left + 20)}px`, top = `${Math.round(box.top - head.top + (box.height - 30) / 2)}px`;
    if (header.style.getPropertyValue('--n19-actions-left') !== left) header.style.setProperty('--n19-actions-left', left);
    if (header.style.getPropertyValue('--n19-actions-top') !== top) header.style.setProperty('--n19-actions-top', top);
    const width = `${Math.round([...actions.querySelectorAll('a, [role="button"]')].filter(b => b.offsetWidth && !b.closest('[data-n19-ig="later"]')).reduce((sum, b) => sum + b.offsetWidth + 8, 0))}px`;
    if (header.style.getPropertyValue('--n19-actions-width') !== width) header.style.setProperty('--n19-actions-width', width);
  };
  const FOOTER_LATER = /^(Meta|Meta AI|Muse|Threads|Consumer Health Privacy|Contact Uploading & Non-Users|Meta Verified|Instagram Lite|Popular|Blog)$/;
  const FOOTER_WORDS = new Map([['About', 'About Us'], ['Help', 'Support'], ['Locations', 'Directory']]);
  const LOGIN_WORDS = new Map([['Mobile number, username or email', 'Phone number, username, or email'], ['Phone number, username or email', 'Phone number, username, or email'], ['Log in', 'Log In'], ['Create new account', 'Sign up'], ['Log in with Facebook', 'Log in with Facebook']]);
  const loginWords = () => {
    for (const node of document.querySelectorAll('form#login_form span, form#login_form label, form#login_form div')) {
      if (node.childElementCount) continue;
      const to = LOGIN_WORDS.get(node.textContent.trim());
      if (to && node.textContent !== to) node.textContent = to;
    }
  };
  const loginWall = () => {
    for (const dialog of document.querySelectorAll('[role="dialog"]:not([data-n19-ig])')) {
      if (!/^See photos, videos and more from /.test(dialog.textContent.trim()) && !/Sign up and never miss a post/.test(dialog.textContent)) continue;
      let layer = dialog;
      for (let up = dialog.parentElement; up && up !== document.body; up = up.parentElement) {
        const box = up.getBoundingClientRect();
        const overlay = getComputedStyle(up).position === 'fixed' || (box.top <= 1 && box.height <= innerHeight + 20 && !up.contains(document.querySelector('main')));
        if (overlay && box.width >= innerWidth - 20 && box.height >= innerHeight - 20) layer = up;
      }
      mark(layer, 'later');
      document.documentElement.setAttribute('data-n19-igwall', '');
      for (const scrim of document.querySelectorAll('body div:empty')) {
        const style = getComputedStyle(scrim), box = scrim.getBoundingClientRect();
        const alpha = +(style.backgroundColor.match(/rgba\([^)]*,\s*([\d.]+)\)/)?.[1] || 0);
        if (style.position === 'fixed' && alpha >= .3 && box.width >= innerWidth - 20 && box.height >= innerHeight - 20) mark(scrim, 'later');
      }
    }
  };
  const loggedOutExtras = () => {
    if (!document.querySelector('a[href^="/accounts/login"]')) return;
    for (const button of document.querySelectorAll('main [role="button"]:not([data-n19-ig])')) {
      if (!/^Show more posts from /.test(button.textContent.trim())) continue;
      let box = button;
      while (box.parentElement && box.parentElement.childElementCount === 1 && box.parentElement.tagName !== 'MAIN') box = box.parentElement;
      mark(box, 'later');
    }
    for (const list of document.querySelectorAll('main ul')) {
      if (list.closest('header, [data-n19-ig]') || list.querySelector('[aria-label^="Story by"], a[href*="/p/"], a[href*="/reel/"]')) continue;
      const people = [...list.children].filter(item => item.querySelector('img') && item.querySelector('[role="button"], a[href^="/"]'));
      if (people.length < 3) continue;
      let box = list;
      while (box.parentElement && box.parentElement.tagName !== 'MAIN' && box.parentElement.childElementCount <= 2 && !box.parentElement.querySelector('header, article, a[href*="/p/"], a[href*="/reel/"]')) box = box.parentElement;
      mark(box, 'later');
    }
  };
  const footer = () => {
    for (const link of document.querySelectorAll('footer a, [data-n19-ig="railcol"] a[href*="about.instagram.com"], [data-n19-ig="railcol"] a[href*="help.instagram.com"], [data-n19-ig="railcol"] a[href^="/legal/"], [data-n19-ig="railcol"] a[href*="developers.facebook.com"], [data-n19-ig="railcol"] a[href^="/explore/locations"], [data-n19-ig="railcol"] a[href^="/language"]')) {
      const text = link.textContent.trim();
      if (FOOTER_LATER.test(text)) { let box = link; while (box.parentElement && box.parentElement.childElementCount === 1 && box.parentElement.tagName !== 'FOOTER') box = box.parentElement; mark(box, 'later'); continue; }
      if (!FOOTER_WORDS.has(text)) continue;
      for (const node of link.querySelectorAll('span, div')) if (node.childElementCount === 0 && node.textContent.trim() === text) node.textContent = FOOTER_WORDS.get(text);
      if (link.childElementCount === 0) link.textContent = FOOTER_WORDS.get(text);
    }
    for (const node of document.querySelectorAll('footer span, footer div, [data-n19-ig="railcol"] span')) {
      if (node.childElementCount || !/INSTAGRAM FROM META|Instagram from Meta/.test(node.textContent)) continue;
      node.textContent = node.textContent.replace(/ from Meta/i, '');
    }
  };
  const clickable = el => el.closest('a, [role="link"], [role="button"], button') || el;
  const app = () => {
    const home = document.querySelector('a[href="/"] svg[aria-label="Home"], svg[aria-label="Home"]');
    if (home && !document.querySelector('[data-n19-ig="rail"]')) {
      for (let up = home.parentElement; up && up !== document.body; up = up.parentElement) {
        const s = getComputedStyle(up);
        if ((s.position === 'fixed' || s.position === 'sticky') && up.offsetHeight > innerHeight * .6 && up.offsetWidth < 400) { mark(up, 'rail'); break; }
      }
    }
    const rail = document.querySelector('[data-n19-ig="rail"]');
    if (rail && !rail.querySelector('[data-n19-ig="barrow"]')) topBar(rail);
    else if (rail) compass(rail);
    barSearch();
    if (rail) document.documentElement.setAttribute('data-n19-igbar', '');
    feedLayout();
    for (const label of LATER_ICONS) {
      for (const svg of document.querySelectorAll(`svg[aria-label="${label}"]`)) {
        if (svg.closest('main [role="tablist"]') && label !== 'Reels') continue;
        const item = clickable(svg);
        if (item !== svg && !item.closest('[data-n19-ig="later"]')) mark(item, 'later');
      }
    }
    const login = document.querySelector('a[href^="/accounts/login"][role="link"]:not(main a, footer a)');
    if (login && !document.querySelector('[data-n19-ig="bar"]')) {
      for (let up = login.parentElement; up && up !== document.body; up = up.parentElement) {
        if (up.offsetWidth >= innerWidth - 20 && up.offsetHeight < 90 && getComputedStyle(up).backgroundColor !== 'rgba(0, 0, 0, 0)') { mark(up, 'bar'); break; }
      }
    }
    const article = document.querySelector('main article');
    if (article && !document.querySelector('[data-n19-ig="feedcol"]') && location.pathname === '/') {
      const img = [...article.querySelectorAll('img')].sort((a, b) => b.offsetWidth - a.offsetWidth)[0];
      if (img && img.offsetWidth >= article.offsetWidth - 4) {
        let col = article;
        for (let up = article.parentElement; up && up.tagName !== 'MAIN' && Math.abs(up.offsetWidth - article.offsetWidth) < 3; up = up.parentElement) col = up;
        if (col !== article) mark(col, 'feedcol');
      }
    }
    for (const post of document.querySelectorAll('main article:not([data-n19-ig])')) {
      const width = post.offsetWidth, media = [...post.querySelectorAll('img, video')].filter(m => m.offsetWidth >= width * .9);
      if (!width || !media.length) continue;
      post.setAttribute('data-n19-ig', 'post');
      const walk = (el, depth) => {
        for (const child of el.children) {
          if (media.some(m => child.contains(m))) { if (depth < 12 && !media.includes(child)) walk(child, depth + 1); }
          else if (child.offsetWidth >= width - 4 && child.offsetHeight) mark(child, 'pad');
        }
      };
      walk(post, 0);
    }
    for (const time of document.querySelectorAll('main time:not([data-n19-ig]), [role="dialog"] article time:not([data-n19-ig])')) {
      if (parseFloat(getComputedStyle(time).fontSize) <= 12.5) mark(time.closest('a') || time, 'stamp');
      else time.setAttribute('data-n19-ig', 'time');
    }
    for (const area of document.querySelectorAll('textarea[aria-label^="Add a comment"]:not([data-n19-ig])')) {
      area.setAttribute('data-n19-ig', 'field');
      const form = area.closest('form');
      if (form) {
        mark(form, 'addrow');
        for (const b of form.querySelectorAll('[role="button"], button[type="submit"]')) if (/^Post$/i.test(b.textContent.trim())) mark(b, 'post-button');
      }
    }
    for (const span of document.querySelectorAll('main span:not([data-n19-ig]):not(:has(*))')) {
      const t = span.textContent.trim();
      if (t === 'Edited' || t === '· Edited' || t === 'Note...' || t === 'Your note') mark(span, 'later');
    }
    for (const tab of document.querySelectorAll('main [role="tablist"] a:not([data-n19-ig="later"])')) {
      const svg = tab.querySelector('svg[aria-label]') || tab.querySelector('svg');
      const name = svg?.getAttribute('aria-label') || tab.getAttribute('aria-label') || svg?.querySelector('title')?.textContent.trim() || '';
      if (/^reels$/i.test(name) || /^reels$/i.test(tab.textContent.trim()) || /\/reels\/?$/.test(tab.getAttribute('href') || '')) { mark(tab.parentElement?.children.length === 1 ? tab.parentElement : tab, 'later'); continue; }
      if (tab.querySelector('[data-n19-ig="tablabel"]')) continue;
      tab.setAttribute('data-n19-ig', 'tab');
      if (name && settled) {
        const text = document.createElement('span');
        text.setAttribute('data-n19-ig', 'tablabel');
        text.textContent = name.toUpperCase();
        if (svg && svg.parentElement !== tab) svg.parentElement.after(text); else tab.append(text);
      }
    }
    if (document.querySelector('main header')) profileHeader();
    if (settled) { footer(); loginWords(); }
    loginWall();
    loggedOutExtras();
    if (document.querySelector('main header') || location.pathname.startsWith('/explore')) {
      for (const link of document.querySelectorAll('main a[href*="/p/"]:not([data-n19-ig]), main a[href*="/reel/"]:not([data-n19-ig])')) {
        if (!link.querySelector('img')) continue;
        link.setAttribute('data-n19-ig', 'tile');
        const tile = link.parentElement, row = tile?.parentElement;
        if (!row) continue;
        const display = getComputedStyle(row).display;
        if (display === 'flex' && row.children.length >= 2 && row.children.length <= 4) mark(row, 'row');
        else if (display === 'grid') mark(row, 'grid');
        const box = link.getBoundingClientRect();
        if (box.height > box.width * 1.5) continue;
        for (const d of link.querySelectorAll('div')) {
          const pad = parseFloat(getComputedStyle(d).paddingBottom);
          if (pad > box.width * .5) { mark(d, 'ratio'); break; }
        }
        if (!link.querySelector('[data-n19-ig="ratio"]') && box.height > box.width * 1.05) mark(link, 'ratio-box');
      }
    }
  };
  let queued = 0, last = 0, settled = false;
  const settle = () => setTimeout(() => { settled = true; later(); }, 1500);
  if (document.readyState === 'complete') settle(); else addEventListener('load', settle, { once: true });
  const run = () => { queued = 0; last = performance.now(); landing(); app(); };
  const later = () => { if (queued) return; queued = setTimeout(() => requestAnimationFrame(run), Math.max(0, 250 - (performance.now() - last))); };
  const start = () => { run(); new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true }); };
  net19.onBody(start);
})();
