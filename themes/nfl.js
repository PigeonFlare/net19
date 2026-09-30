globalThis.net19Theme = {
  detect: () => document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  watch: ['class'],
  later: /^(?:my team|tickets|vip experiences|download ios app|download android app|tiktok|snapchat|subscription terms & conditions|careers|nfl writers|series|the athletic|inclusion|in the community|inspire change|nfl hbcu|por la cultura|play football|play 60|nfl origins|nfl football operations|on location|pro football hall of fame|usa football|nfl extra points credit card|nfl ticket exchange|nfl auction|flag football|activate - ctv|nfl communications|media guides|record & fact book|rule book|licensing|nfl health & safety|player engagement|nfl legends community|nfl alumni association|nfl player care)(?:arrow upright)?$/i,
};
(() => {
  const PLUS = /^(?:NFL\+|MY TEAM)$/i;
  const run = () => {
    for (const tab of document.querySelectorAll('[role="tab"]:not([data-net19-hidden])')) if (PLUS.test(tab.textContent.trim())) tab.setAttribute('data-net19-hidden', '');
  };
  net19.watch(run);
})();
