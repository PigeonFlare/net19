globalThis.net19Theme = {
  detect: () => document.documentElement.classList.contains('encore-dark-theme') ? 'dark' : 'light',
  watch: ['class'],
  only: () => document.documentElement.classList.contains('encore-dark-theme') ? 'dark' : undefined,
  light: { '#1ed760': '#1db954' },
  dark: { '#1ed760': '#1db954' },
  later: /^(?:import your music|audiobooks access|audiobooks|show now playing view|music videos|profiles)$/i,
};
(() => {
  if (location.hostname !== 'support.spotify.com') return;
  const fix = () => { if (globalThis.net19Lang?.() === 'en') for (const f of document.querySelectorAll('[class*="EntryPoint_textareaWrapper"] textarea')) if (f.placeholder !== 'Search') f.placeholder = 'Search'; };
  const start = () => { fix(); new MutationObserver(fix).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['placeholder'] }); };
  net19.onBody(start);
})();
(() => {
  if (location.hostname !== 'open.spotify.com') return;
  const fix = () => {
    for (const b of document.querySelectorAll('[data-testid="action-bar-row"] [data-testid="play-button"]')) {
      const inner = b.firstElementChild;
      if (!inner) continue;
      const word = (b.getAttribute('aria-label') || '').split(' ')[0] || 'Play';
      let tag = inner.querySelector(':scope > .n19-play');
      if (!tag) { tag = document.createElement('span'); tag.className = 'n19-play'; inner.append(tag); }
      if (tag.textContent !== word) tag.textContent = word;
    }
  };
  const start = () => { fix(); new MutationObserver(fix).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-label'] }); };
  net19.onBody(start);
})();
globalThis.net19Theme.words = {"Importar tu música": "Import your music", "Importer votre musique": "Import your music", "Importar suas músicas": "Import your music", "Importa la tua musica": "Import your music", "音楽をインポート": "Import your music", "导入你的音乐": "Import your music", "내 음악 가져오기": "Import your music", "Импорт музыки": "Import your music", "अपना म्यूज़िक इंपोर्ट करें": "Import your music", "استيراد ملفاتك الموسيقية": "Import your music"};
