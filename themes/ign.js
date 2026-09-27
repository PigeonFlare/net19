// net19 handmade theme: IGN, 2019. IGN marks its own light/dark theme as html[data-theme], following the device;
// both get the 2019 design (2019's IGN had no dark theme, so dark is the same design in dark neutrals).
globalThis.net19Theme = {
  detect: () => document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
  watch: ['data-theme'],
  // Post-2019 entry points, by label: Daily Games and playables (2024), Shorts (2022), Playlist and "Are You Playing?"
  // (2023), Rewards (2024), IGN Plus (2023), and Google's preferred-source buttons (2025).
  later: /^(?:daily games|play daily games|playables|shorts|ign shorts|playlist|my playlist|playlists|are you playing\??|rewards|ign rewards|ign plus|get ign plus|join ign plus|add ign on google|add source)$/i,
};
