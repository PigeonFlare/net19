// net19 handmade theme: mlb. MLB.com has a single (light) design. Club pages (/yankees, player pages) paint <body> in the
// club's dark color behind light content, so the background-luminance default would read them as dark and flip them;
// the mode is therefore always light, and palette.js inverts the page only for dark devices.
globalThis.net19Theme = { detect: () => 'light' };
