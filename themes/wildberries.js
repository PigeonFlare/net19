// net19 handmade theme: Wildberries, 2019. The "mo" design system's accent purple (#a73afd, 2023) and its light tint
// go back to 2019's magenta #cb11ab everywhere they are used (buttons, links, chips, the cart counter).
globalThis.net19Theme = {
  light: { '#a73afd': '#cb11ab', '#f8e7ff': '#fbe7f7', '#ed3cca': '#cb11ab' },
  dark: { '#a73afd': '#cb11ab' },
  // AI review summaries and the shopping assistant (2024) did not exist in 2019.
  later: /^(?:ai-ассистент|ai ассистент|ии-помощник|ии помощник|спросить ии|кратко об отзывах|коротко об отзывах|нейроотзыв)$/i,
};
