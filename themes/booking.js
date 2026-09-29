globalThis.net19Theme = {
  light: { '#003b95': '#003580', '#006ce4': '#0071c2', '#0057b8': '#00487a', '#ffb700': '#febb02', '#1a4fa0': '#003580' },
  dark: { '#003b95': '#002a66', '#006ce4': '#4aa3ff', '#0057b8': '#1f8ce0', '#ffb700': '#febb02', '#1a4fa0': '#002a66' },
};
(() => {
  const fix = () => {
    const input = document.querySelector('input[name="ss"], #searchbox-horizontal-destination-input');
    if (input && input.placeholder !== 'Where are you going?') input.placeholder = 'Where are you going?';
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['placeholder'] }); };
  if (document.body) start(); else new MutationObserver((_, o) => { if (document.body) { o.disconnect(); start(); } }).observe(document.documentElement, { childList: true });
})();
