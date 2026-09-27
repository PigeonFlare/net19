// net19 handmade theme: imdb. IMDb has no dark mode of its own; imdb.css draws its 2019 page in the device's mode
// (the white 2019 page on light devices, the same layout on IMDb's own dark colors on dark ones), so the page is
// reported in the device's mode and palette.js never inverts it (inverted, IMDb's #f5c518 yellow turned brown).
globalThis.net19Theme = { detect: () => (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'), watch: [] };
