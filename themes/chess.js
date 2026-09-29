globalThis.net19Theme = {
  detect: () => (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  watch: [],
  intended: '[data-net19-hidden]',
  later: /^(?:game review|train|remove ads|chess terms|students|cheating & fair play|partners|tiktok|discord|\d+ day streak)$/i,
};
