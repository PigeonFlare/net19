(() => {
  const map = {
    '#004fcb': '#085ff7', '#003a9b': '#0452d8', '#002970': '#0444b4',
    '#f7f6f5': '#f7f7f7', '#f3f2f1': '#f2f2f2', '#e4e2e0': '#e4e4e4', '#d4d2d0': '#d4d4d4', '#b4b2b1': '#b3b3b3',
  };
  globalThis.net19Theme = { light: map, dark: map };
})();
(() => {
  const fix = () => {
    const home = !!document.getElementById('jobsearch-HomePage');
    if (document.documentElement.hasAttribute('data-n19-home') !== home) document.documentElement.toggleAttribute('data-n19-home', home);
    const button = document.querySelector('#jobsearch .yosegi-InlineWhatWhere-primaryButton span');
    if (button && button.textContent === 'Search') button.textContent = 'Find Jobs';
    const tab = document.querySelector('#gnav-main-container a#FindJobs');
    if (tab && tab.childNodes.length === 1 && tab.firstChild.nodeType === 3 && tab.textContent === 'Home') tab.firstChild.nodeValue = 'Find Jobs';
  };
  net19.watch(fix, { childList: true, subtree: true, characterData: true });
})();
