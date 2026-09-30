globalThis.net19Theme = {
  detect: () => document.documentElement.classList.contains('dark-bg') ? 'dark' : undefined,
  watch: ['class'],
  later: /^(?:duck\.ai|search assist|ask ai|ai settings|download browser|set as default search|upgrade to our browser|get the duckduckgo browser|share feedback)$/i,
};
(() => {
  const mark = (el, name) => { if (el && el.getAttribute('data-n19-ddg') !== name) el.setAttribute('data-n19-ddg', name); };
  const vertical = href => { try { const url = new URL(href, location.href); return url.searchParams.get('ia') || 'web'; } catch { return ''; } };
  const run = () => {
    const bar = document.querySelector('[data-testid="duckbar"] nav');
    if (bar) {
      const current = vertical(location.href);
      const tabs = [...bar.querySelectorAll('li > a[href*="q="]')].filter(a => !/assist=true|ia=chat/.test(a.getAttribute('href')));
      for (const tab of tabs) {
        const on = vertical(tab.href) === current;
        if (on) mark(tab, 'tab-on'); else if (tab.hasAttribute('data-n19-ddg')) tab.removeAttribute('data-n19-ddg');
      }
      const all = tabs[0]?.querySelector('strong');
      if (all && globalThis.net19Lang?.() === 'en') {
        const text = [...all.childNodes].find(n => n.nodeType === 3 && n.data.trim() === 'All');
        if (text) text.data = text.data.replace('All', 'Web');
      }
    }
    const form = document.querySelector('main[data-testid="home-desktop"] form#searchbox_homepage');
    const section = form?.closest('header > section');
    const field = form?.querySelector('textarea, input[type="text"], input:not([type])');
    if (section && field) { const typed = field.value.trim() !== ''; if (typed !== section.hasAttribute('data-n19-typed')) section.toggleAttribute('data-n19-typed', typed); }
    if (field && !field.hasAttribute('data-n19-ddg')) { mark(field, 'field'); field.addEventListener('input', run); }
    const say = globalThis.net19Say;
    const tagline = say?.("The search engine that doesn't track you."), learn = say?.('Learn More');
    if (section && tagline && learn && !section.querySelector('[data-n19-ddg="tagline"]')) {
      const line = document.createElement('p');
      mark(line, 'tagline');
      const more = document.createElement('a');
      more.href = '/about';
      more.textContent = learn;
      line.append(tagline, ' ', more, '.');
      section.append(line);
    }
  };
  net19.watch(run);
})();
