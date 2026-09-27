// net19 handmade theme: Chess.com, 2019. Chess.com keeps the account's light/dark choice as html.light-mode or
// html.dark-mode (signed out it is always dark). Its design tokens are re-pointed to the 2019 palette for the device's
// mode, so the page is drawn in that mode directly and never flipped: boards, pieces and photos stay as drawn.
globalThis.net19Theme = {
  detect: () => (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  watch: [],
  // Post-2019 entry points, by label: Game Review (2021), the "Train" hub (2025), the profile's day-streak badge (2023).
  later: /^(?:game review|train|\d+ day streak)$/i,
};
