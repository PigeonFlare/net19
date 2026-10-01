globalThis.net19Theme = {
  home: () => location.pathname === '/' && !!document.querySelector('body.logged-out, .lp-Home'),
  brand: () => !!document.body?.classList.contains('logged-out') && document.documentElement.getAttribute('data-color-mode') === 'dark' && !globalThis.net19Theme.home(),
  detect() {
    if (globalThis.net19Theme.home()) return 'light';
    if (globalThis.net19Theme.brand()) return 'dark';
    const root = document.documentElement;
    const mode = root.getAttribute('data-color-mode');
    const system = matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = mode === 'dark' || mode === 'auto' && system ? root.getAttribute('data-dark-theme') : root.getAttribute('data-light-theme');
    return /dark/.test(theme || (mode === 'dark' ? 'dark' : '')) ? 'dark' : 'light';
  },
  only: () => globalThis.net19Theme.home() ? 'light' : globalThis.net19Theme.brand() ? 'dark' : undefined,
  later: /^(?:open in github copilot app|github copilot|copilot(?: chat| spaces?| app)?|ask copilot|copy markdown|agents?|spaces|new agent task|assign to copilot)$/i,
  watch: ['data-color-mode', 'data-light-theme', 'data-dark-theme'],
  intended: '.lp-Home #automation, .lp-Home #security, .lp-Home #customer-stories, [data-n19-later], aside[aria-label="Issues sidebar navigation"], [class*="PageLayout-PaneWrapper"]:has(#repos-file-tree), footer li, footer div',
  light: { '#1f2328': '#24292e', '#59636e': '#586069', '#0969da': '#0366d6', '#f6f8fa': '#fafbfc', '#d1d9e0': '#e1e4e8', '#d1d9e0b3': '#eaecef',
    '#25292e': '#24292e', '#fd8c73': '#e36209', '#1f883d': '#28a745', '#ddf4ff': '#f1f8ff' },
};
(() => {
  const setText = (el, from, to) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) if (node.data.trim() === from) { node.data = node.data.replace(from, to); const holder = node.parentElement?.closest('[data-content]'); if (holder?.getAttribute('data-content') === from) holder.setAttribute('data-content', to); return true; }
    return false;
  };
  const header2019 = () => {
    const list = document.querySelector('header.HeaderMktg nav > ul');
    if (!list || list.hasAttribute('data-n19-nav')) return;
    const items = [...list.children];
    const named = name => items.find(li => (li.querySelector(':scope > div > button, :scope > a')?.textContent || '').trim() === name);
    const platform = named('Platform'), solutions = named('Solutions'), resources = named('Resources'), open = named('Open Source'), enterprise = named('Enterprise'), pricing = named('Pricing');
    if (!platform || !open || !pricing) return;
    list.setAttribute('data-n19-nav', '');
    setText(platform.querySelector('button'), 'Platform', 'Why GitHub?');
    setText(open.querySelector('button'), 'Open Source', 'Explore');
    for (const li of [solutions, resources]) li?.setAttribute('data-n19-later', '');
    if (enterprise) platform.after(enterprise);
    const market = pricing.cloneNode(true);
    const link = market.querySelector('a');
    if (link) { link.href = '/marketplace'; link.removeAttribute('data-analytics-event'); setText(link, 'Pricing', 'Marketplace'); pricing.before(market); }
  };
  const hero2019 = () => {
    const hero = document.querySelector('.lp-Home .lp-IntroHero > section');
    if (!hero || hero.hasAttribute('data-n19-hero')) return;
    const title = hero.querySelector('h1'), lead = hero.querySelector('p');
    if (!title || !lead) return;
    hero.setAttribute('data-n19-hero', '');
    for (const provider of document.querySelectorAll('footer [data-color-mode="dark"], [data-color-mode="dark"]:has(> footer)')) provider.setAttribute('data-color-mode', 'light');
    title.textContent = 'Built for developers';
    lead.textContent = 'GitHub is a development platform inspired by the way you work. From open source to business, you can host and review code, manage projects, and build software alongside millions of developers.';
  };
  const SVG = 'http://www.w3.org/2000/svg';
  const icon = (d, size = 16) => { const svg = document.createElementNS(SVG, 'svg'); svg.setAttribute('viewBox', '0 0 16 16'); svg.setAttribute('width', size); svg.setAttribute('height', size); svg.setAttribute('aria-hidden', 'true'); const path = document.createElementNS(SVG, 'path'); path.setAttribute('d', d); svg.append(path); return svg; };
  const BOOK = 'M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.25.25 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z';
  const BELL = 'M8 16a2 2 0 0 0 1.985-1.75c.017-.137-.097-.25-.235-.25h-3.5c-.138 0-.252.113-.235.25A2 2 0 0 0 8 16ZM3 5a5 5 0 0 1 10 0v2.947c0 .05.015.098.042.139l1.703 2.555A1.519 1.519 0 0 1 13.482 13H2.518a1.516 1.516 0 0 1-1.263-2.36l1.703-2.554A.255.255 0 0 0 3 7.947Zm5-3.5A3.5 3.5 0 0 0 4.5 5v2.947c0 .346-.102.683-.294.97l-1.703 2.556a.017.017 0 0 0-.003.01l.001.006c0 .002.002.004.004.006l.006.004.007.001h10.964l.007-.001.006-.004.004-.006.001-.007a.017.017 0 0 0-.003-.01l-1.703-2.554a1.745 1.745 0 0 1-.294-.97V5A3.5 3.5 0 0 0 8 1.5Z';
  const repoPath = () => { const [owner, repo] = location.pathname.split('/').filter(Boolean); return owner && repo ? { owner, repo } : null; };
  const repoTitle = () => {
    const where = repoPath();
    const title = document.querySelector('#repo-title-component > div');
    if (title && where && !title.querySelector('[data-n19-owner]')) {
      const name = title.querySelector('.prc-Truncate-Truncate-2G1eo, [class*="Truncate-Truncate"]') || title.querySelector('strong')?.parentElement;
      if (name) {
        const book = icon(BOOK); book.setAttribute('data-n19-book', '');
        const owner = document.createElement('span'); owner.setAttribute('data-n19-owner', '');
        const link = document.createElement('a'); link.href = `/${where.owner}`; link.textContent = where.owner;
        const slash = document.createElement('span'); slash.setAttribute('data-n19-slash', ''); slash.textContent = '/';
        owner.append(link, slash);
        name.before(book, owner);
      }
    }
    return !!title;
  };
  const globalNav = () => {
    const header = document.querySelector('header.GlobalNav');
    if (!header) return;
    const left = header.querySelector('[class*="styles-module__left__"]'), mid = header.querySelector('[class*="styles-module__center__"]'), right = header.querySelector('[class*="styles-module__right__"]');
    if (!left || !mid || !right) return;
    if (!mid.querySelector(':scope > [data-n19-links]')) {
      const nav = document.createElement('nav'); nav.setAttribute('data-n19-links', '');
      for (const [href, label] of [['/pulls', 'Pull requests'], ['/issues', 'Issues'], ['/marketplace', 'Marketplace'], ['/explore', 'Explore']]) {
        const text = net19.say(label); if (!text) continue;
        const a = document.createElement('a'); a.href = href; a.textContent = text; nav.append(a);
      }
      mid.append(nav);
    }
    const search = mid.querySelector('button[aria-label*="search" i]');
    if (search && !search.querySelector('[data-net19-label]')) {
      const text = net19.say('Search or jump to…');
      if (text) { const label = document.createElement('span'); label.setAttribute('data-net19-label', ''); label.textContent = text; search.append(label); }
    }
    const plus = right.querySelector('button[class*="GlobalCreateMenu"]');
    if (plus && !right.querySelector('[data-n19-bell]')) {
      const bell = document.createElement('a'); bell.href = '/notifications'; bell.setAttribute('data-n19-bell', ''); bell.setAttribute('aria-label', 'Notifications'); bell.append(icon(BELL));
      plus.before(bell);
    }
    const tabs = header.querySelector('nav[aria-label="Repository"]');
    const root = document.documentElement;
    const band = document.querySelector('[class*="PageLayout-Header-"]:has(#repo-title-component)');
    if (tabs && band) {
      if (!root.hasAttribute('data-n19-repohead')) root.setAttribute('data-n19-repohead', '');
      const top = `${Math.round(band.getBoundingClientRect().bottom - header.getBoundingClientRect().top)}px`;
      if (root.style.getPropertyValue('--n19-tabs-top') !== top) root.style.setProperty('--n19-tabs-top', top);
    } else if (root.hasAttribute('data-n19-repohead')) root.removeAttribute('data-n19-repohead');
    const where = repoPath();
    const own = header.querySelector('[data-n19-repotitle]');
    if (tabs && where && !band && !own) {
      const row = document.createElement('div'); row.setAttribute('data-n19-repotitle', '');
      const inner = document.createElement('div');
      const owner = document.createElement('a'); owner.href = `/${where.owner}`; owner.textContent = where.owner;
      const slash = document.createElement('span'); slash.textContent = '/';
      const repo = document.createElement('a'); repo.href = `/${where.owner}/${where.repo}`; repo.textContent = where.repo; repo.setAttribute('data-n19-repo', '');
      inner.append(icon(BOOK), owner, slash, repo); row.append(inner);
      tabs.before(row);
    } else if (own && (band || !tabs || !where || !own.querySelector(`a[href="/${where.owner}/${where.repo}"]`))) own.remove();
    const edit = document.querySelector('[class*="SidebarSection-module__sidebarSection"] h2 button[aria-label^="Edit repository" i]');
    if (edit && !edit.querySelector('[data-n19-edit]')) {
      const text = net19.say('Edit');
      if (text) { const label = document.createElement('span'); label.setAttribute('data-n19-edit', ''); label.textContent = text; edit.append(label); }
    }
  };
  const fix = () => {
    header2019();
    repoTitle();
    globalNav();
    hero2019();
    for (const heading of document.querySelectorAll('footer :is(h2, h3):not([data-n19-named])')) {
      const name = heading.textContent.trim(), renamed = { Platform: 'Product', Ecosystem: 'Platform' }[name];
      if (renamed) { heading.setAttribute('data-n19-named', ''); setText(heading, name, renamed); }
    }
    const watch = document.querySelector('#repository-details-watch-button');
    if (watch) setText(watch, 'Notifications', 'Watch');
    for (const security of document.querySelectorAll('#security-and-quality-tab, header.GlobalNav nav[aria-label="Repository"] a[href$="/security"]')) setText(security, 'Security and quality', 'Security');
    const search = document.querySelector('header.HeaderMktg button[aria-label^="Search or jump" i]');
    if (search && !search.querySelector('[data-net19-label]')) {
      const label = document.createElement('span');
      label.setAttribute('data-net19-label', '');
      label.textContent = 'Search GitHub';
      search.append(label);
    }
    for (const el of document.querySelectorAll('header button, header [role="button"]')) {
      net19.rename(el, /^Search or ask Copilot$/i, 'Search GitHub Docs');
    }
    for (const button of document.querySelectorAll('#repo-content-pjax-container button[data-variant="primary"], react-partial button[data-variant="primary"]')) {
      net19.rename(button, 'Code', 'Clone or download');
    }
  };
  const later = net19.frame(fix);
  net19.onBody(() => { addEventListener('load', later, { once: true }); addEventListener('resize', later); for (const t of [1000, 3000, 6000]) setTimeout(later, t); });
  net19.watch(fix);
})();
