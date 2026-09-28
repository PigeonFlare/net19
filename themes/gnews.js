globalThis.net19Theme = {
  detect() {
    const probe = getComputedStyle(document.documentElement).getPropertyValue('--gn-c-background').trim().toLowerCase();
    const m = probe.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$|^#([0-9a-f])([0-9a-f])([0-9a-f])$/);
    if (m) { const [r, g, b] = (m[1] ? m.slice(1, 4) : m.slice(4, 7).map(x => x + x)).map(x => parseInt(x, 16)); return (.2126 * r + .7152 * g + .0722 * b) / 255 < .35 ? 'dark' : 'light'; }
    return undefined;
  },
  watch: ['class', 'style'],
  later: /^(?:ai summary|summari[sz]e(?: this)?(?: story| article)?|ask about this story)$/i,
  keepLabels: /^(?:top stories|for you|following|favorites|home)$/i,
};
(() => {
  const RENAME = { Home: 'Top stories', Following: 'Favorites' };
  const fix = () => {
    for (const el of document.querySelectorAll('main a[aria-label^="See more headlines" i] div, main a[href*="/stories/"] > div')) {
      if (!el.children.length && /^See more headlines/i.test(el.textContent.trim())) el.textContent = 'View full coverage';
    }
    for (const h of document.querySelectorAll('main h1, main h2')) {
      if (!h.children.length && /^Your\s+briefing$/i.test(h.textContent.trim())) h.textContent = 'Headlines';
    }
    for (const a of document.querySelectorAll('body > c-wiz[role="navigation"] a[role="tab"][aria-label]')) {
      const name = a.getAttribute('aria-label');
      const to = RENAME[name];
      if (!to) continue;
      a.setAttribute('aria-label', to);
      const walker = document.createTreeWalker(a, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) if (n.nodeValue.trim() === name) n.nodeValue = n.nodeValue.replace(name, to);
    }
    for (const link of document.querySelectorAll('main a[href*="finance.google.com"][href*="source=news"]:not([data-n19-seen])')) {
      link.setAttribute('data-n19-seen', '');
      let box = link;
      while (box.parentElement && box.parentElement.tagName !== 'MAIN' && box.parentElement.getBoundingClientRect().height < 200 && !box.parentElement.querySelector('article')) box = box.parentElement;
      if (box !== link) box.setAttribute('data-net19-hidden', '');
    }
    const here = location.pathname.replace(/^\/(home)?$/, '/home');
    for (const a of document.querySelectorAll('body > c-wiz[role="navigation"] a[role="tab"]')) {
      let path = '';
      const href = a.getAttribute('href');
      if (href) try { path = new URL(a.href).pathname; } catch {}
      const on = !!path && (path === here || (path.startsWith('/topics/') && here.startsWith('/topics/') && path.slice(0, 48) === here.slice(0, 48)));
      if (on !== a.hasAttribute('data-n19-current')) a.toggleAttribute('data-n19-current', on);
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); addEventListener('popstate', later); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
