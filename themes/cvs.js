globalThis.net19Theme = {
  light: { '#004d99': '#cc0000', '#0066cc': '#cc0000', '#013f7c': '#a30000', '#003c78': '#a30000', '#e6f3ff': '#fdeaea' },
  dark: { '#004d99': '#ff5a5a', '#0066cc': '#ff5a5a', '#013f7c': '#ff8080', '#003c78': '#ff8080', '#e6f3ff': '#3a1616' },
};
(() => {
  const rules = `a,button,span,p,input,label{font-family:var(--n19-font)!important}
.sign-in-link,.link-cta-subtle.emphasized{color:var(--n19-red)!important;white-space:nowrap!important}
.new-search-box-style{border-radius:2px!important;border-color:#999!important}
.link-cta-subtle,.button__text--subtle{border-radius:0!important}
.button__solid.emphasized,a.link-cta.emphasized{background-color:var(--n19-red)!important;border-color:var(--n19-red)!important;color:#fff!important;border-radius:0!important}
.quicklink-nav a,.quicklink-nav a *{color:var(--n19-text)!important;font-weight:700!important}
.quicklink-nav a:hover,.quicklink-nav a:hover *{color:var(--n19-red)!important}
.quicklink-nav a img,.quicklink-nav a svg{display:none!important}
.quicklink-nav a[href*="glp1" i],.quicklink-nav li:has(> a[href*="glp1" i]){display:none!important}
img[data-net19-glyph]{filter:invert(1) hue-rotate(180deg)!important}
:has(> img[data-net19-glyph]){filter:none!important}`;
  let sheet = null;
  const done = new WeakSet();
  const visit = root => {
    for (const el of root.querySelectorAll('[class*="hydrated"]')) {
      const sr = el.shadowRoot;
      if (!sr) continue;
      if (!done.has(sr)) {
        done.add(sr);
        if (!sheet) { sheet = new CSSStyleSheet(); sheet.replaceSync(rules); }
        sr.adoptedStyleSheets = [...sr.adoptedStyleSheets, sheet];
      }
      for (const input of sr.querySelectorAll('input[placeholder]')) if (/ask a question/i.test(input.placeholder)) input.placeholder = 'Search';
      visit(sr);
    }
  };
  const pass = () => { for (const input of document.querySelectorAll('input[placeholder]')) if (/ask a question/i.test(input.placeholder)) input.placeholder = 'Search';
    const header = document.querySelector('cvs-header, cvs-header-desktop, cvs-header-mobile'); if (header) visit(header.parentNode || document); };
  const timed = () => { for (const ms of [0, 500, 1500, 3000, 6000, 10000, 16000, 25000]) setTimeout(pass, ms); };
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', timed, { once: true }); else timed();
  addEventListener('load', () => { for (const ms of [0, 800, 2500, 6000]) setTimeout(pass, ms); }, { once: true });
})();
