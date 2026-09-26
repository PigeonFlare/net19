// net19 handmade theme: TechCrunch, 2019. TechCrunch has a single (light) design, so the default background-luminance
// detection keeps it light and the engine inverts the page on dark devices. The 2024 palette (a darker green, a
// near-black, a purple for promotions) is pointed back at 2019's greens and plain black.
globalThis.net19Theme = {
  light: {
    '#0a8935': '#00a562', '#0aa43e': '#0a9e01', '#212623': '#000000', '#151a17': '#000000', '#2c312e': '#333333', '#edf1ef': '#f1f1f1',
    '#d2dcd7': '#dddddd', '#b5c0bc': '#999999', '#6c7571': '#777777', '#535554': '#555555', '#5631ea': '#00a562', '#68f176': '#00d301',
  },
  // "Headlines only" view switch (2023) and the StrictlyVC / ticket promotions.
  later: /^(?:headlines only|get your ticket|get tickets|buy tickets|25% off tickets now)$/i,
};
