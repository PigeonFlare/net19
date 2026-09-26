// net19 handmade theme: POLITICO, 2019. POLITICO has a single light design, so the page is read as light and the
// engine inverts it on dark devices. Post-2019 controls are hidden by label.
globalThis.net19Theme = {
  detect: () => 'light',
  later: /^(?:add politico on google.*|listen to this article|listen|gift this article|share this article with ai|politico pro upgrade|more from politico)$/i,
  keepLabels: /^(?:search|pro|magazine)$/i,
};
