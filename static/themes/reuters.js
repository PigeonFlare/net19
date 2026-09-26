// net19 handmade theme: Reuters, 2019. Reuters has a single light design, so the page is read as light and the engine
// inverts it on dark devices. Post-2019 controls are hidden by label.
globalThis.net19Theme = {
  detect: () => 'light',
  later: /^(?:subscribe|subscribe now|register|register now|my news|gift article|gift this article|listen to article|save article|reuters\+|reuters plus|lseg|exclusive news, data and analytics for financial market professionals)$/i,
};
