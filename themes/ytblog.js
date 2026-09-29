globalThis.net19Theme = { detect: () => (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'), watch: [], later: /^(?:yoodles|youtube shorts|made on youtube|ai|shorts|podcast|podcasts)$/i };
(() => {
  const fix = () => {
    for (const a of document.querySelectorAll('a.yt-header__youtube-logo')) {
      if (a.querySelector(':scope > .n19-blog-title')) continue;
      const t = document.createElement('span');
      t.className = 'n19-blog-title';
      t.textContent = 'Official Blog';
      a.append(t);
    }
  };
  const start = () => { fix(); new MutationObserver(fix).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else new MutationObserver((_, o) => { if (document.body) { o.disconnect(); start(); } }).observe(document.documentElement, { childList: true });
})();
