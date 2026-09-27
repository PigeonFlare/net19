// net19 handmade theme: Yahoo! JAPAN, 2019. Yahoo! JAPAN has no dark mode on the PC site; default detection keeps it
// light and the device's dark setting flips the page. Its AI entry points (AIモード search, the Agent i assistant,
// AI answers and summaries, 2023 onward) are hidden by their labels wherever a Yahoo! JAPAN service shows them.
globalThis.net19Theme = {
  later: /^(?:AIモード(?:で検索)?|AIアシスタント|AIエージェント|Agent\s*i|AIに質問(?:する)?|AIチャット|AIで(?:回答|要約|質問|検索)|AI(?:回答|要約|検索|で要約する)|AIが(?:回答|要約)|NEW\s*Agent\s*i|i\s*と探す|AIと探す)$/i,
};
