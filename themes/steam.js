// net19 handmade theme: Steam, 2019. The store and the community were dark-only in 2019, as they are today, so the
// page is never flipped. Post-2019 menu entries are hidden by label: the Points Shop (2020), Steam Families (2024),
// Steam Deck (2022) and later hardware, the "Open in Desktop App" prompt and digital gift cards.
globalThis.net19Theme = {
  only: 'dark',
  detect: () => 'dark',
  searchLabel: 'search the store',
  later: /^(?:award|points shop|steam points|my family|steam families|family management|steam deck|steam deck verified|great on deck|steam deck compatibility|steam frame|steam machine|steam controller \(2026\)|steam replay|game recording|open in desktop app|send a gift card|digital gift cards?)$/i,
};
