globalThis.net19Theme = {};
(() => {
  const rules = 'adc-tab::part(tab){color:var(--n19-blue)!important;font-weight:300!important;font-size:20px!important}'
    + 'adc-tab,adc-tab *{font-weight:300!important;color:var(--n19-blue)!important}';
  let sheet = null;
  const pass = () => {
    const sr = document.querySelector('adc-header')?.shadowRoot;
    if (!sr || sheet && sr.adoptedStyleSheets.includes(sheet)) return;
    if (!sheet) { sheet = new CSSStyleSheet(); sheet.replaceSync(rules); }
    sr.adoptedStyleSheets = [...sr.adoptedStyleSheets, sheet];
  };
  addEventListener('load', () => { for (const ms of [0, 1000, 3000, 6000]) setTimeout(pass, ms); }, { once: true });
})();
