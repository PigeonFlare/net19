// net19 handmade theme: AP News, 2019. AP has a single light design (only some modules are drawn dark), so the page
// is read as light and the engine inverts it on dark devices. Post-2019 controls are hidden by label.
globalThis.net19Theme = {
  detect: () => 'light',
  later: /^(?:add ap news on google|ap news on google|get the ap news app|download the app|live|live updates|listen to this article|gift this article)$/i,
};
// The header's "MORE" is written in capitals in the markup; 2019's links were in normal case.
(() => {
  const fix = () => { for (const el of document.querySelectorAll('.MainNavigationItem-more')) for (const n of el.childNodes) if (n.nodeType === 3 && /^\s*MORE\s*$/.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace('MORE', 'More'); };
  const start = () => { fix(); new MutationObserver(() => requestAnimationFrame(fix)).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
