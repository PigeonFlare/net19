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
  light: { '#1f2328': '#24292e', '#59636e': '#586069', '#0969da': '#0366d6', '#f6f8fa': '#fafbfc', '#d1d9e0': '#e1e4e8', '#d1d9e0b3': '#eaecef',
    '#25292e': '#24292e', '#fd8c73': '#e36209', '#1f883d': '#28a745', '#ddf4ff': '#f1f8ff' },
};
(() => {
  const fix = () => {
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
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
