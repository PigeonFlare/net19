globalThis.net19Theme = {
  detect: () => (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  watch: [],
  later: /^(?:game review|train|\d+ day streak)$/i,
};
