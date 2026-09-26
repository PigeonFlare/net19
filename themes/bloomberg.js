// net19 handmade theme: Bloomberg, 2019. Bloomberg has a single (light) design on the web, so the default
// background-luminance detection keeps it light and the engine inverts the page on dark devices.
globalThis.net19Theme = {
  // Gift links (2023), saved articles (2022) and the AI summary box ("Takeaways by Bloomberg AI", 2025).
  later: /^(?:gift this article|gift|save|saved|takeaways by bloomberg ai|bloomberg ai|ai summary)$/i,
};
