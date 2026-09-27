(() => {
  const dark = matchMedia('(prefers-color-scheme: dark)');
  const mode = () => dark.matches ? 'dark' : 'light';
  globalThis.net19Theme = { detect: mode, watch: [] };
  document.documentElement?.setAttribute('data-net19-mode', mode());
  const subreddit = () => {
    for (const sheet of document.querySelectorAll('link[title="applied_subreddit_stylesheet"], style[title="applied_subreddit_stylesheet"]')) {
      if (!sheet.hasAttribute('data-net19-media')) sheet.setAttribute('data-net19-media', sheet.getAttribute('media') || 'all');
      const media = dark.matches ? 'not all' : sheet.getAttribute('data-net19-media');
      if (sheet.getAttribute('media') !== media) sheet.setAttribute('media', media);
    }
  };
  const watch = new MutationObserver(subreddit);
  watch.observe(document, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', () => { subreddit(); watch.disconnect(); }, { once: true });
  dark.addEventListener?.('change', subreddit);
})();
