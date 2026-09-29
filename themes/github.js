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
    for (let node = walker.nextNode(); node; node = walker.nextNode()) if (node.data.trim() === from) { node.data = node.data.replace(from, to); return true; }
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
  const fix = () => {
    header2019();
    hero2019();
    for (const heading of document.querySelectorAll('footer :is(h2, h3):not([data-n19-named])')) {
      const name = heading.textContent.trim(), renamed = { Platform: 'Product', Ecosystem: 'Platform' }[name];
      if (renamed) { heading.setAttribute('data-n19-named', ''); setText(heading, name, renamed); }
    }
    const watch = document.querySelector('#repository-details-watch-button');
    if (watch) setText(watch, 'Notifications', 'Watch');
    const security = document.querySelector('#security-and-quality-tab');
    if (security) setText(security, 'Security and quality', 'Security');
    const search = document.querySelector('header.HeaderMktg button[aria-label^="Search or jump" i]');
    if (search && !search.querySelector('[data-net19-label]')) {
      const label = document.createElement('span');
      label.setAttribute('data-net19-label', '');
      label.textContent = 'Search GitHub';
      search.append(label);
    }
    for (const el of document.querySelectorAll('header button, header [role="button"]')) {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) if (/^\s*Search or ask Copilot\s*$/i.test(node.data)) node.data = 'Search GitHub Docs';
    }
    for (const button of document.querySelectorAll('#repo-content-pjax-container button[data-variant="primary"], react-partial button[data-variant="primary"]')) {
      const walker = document.createTreeWalker(button, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) if (node.data.trim() === 'Code') node.data = node.data.replace('Code', 'Clone or download');
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => {
    fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true });
    addEventListener('load', later, { once: true }); for (const t of [1000, 3000, 6000]) setTimeout(later, t);
  };
  net19.onBody(start);
})();
