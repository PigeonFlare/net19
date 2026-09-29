globalThis.net19Theme = {
  intended: '[data-n19-post2019], #main-nav li:has(> a:is([href^="/thesaurus/"], [href^="/games/"])), footer#footer a:is([href*="/editorial/word-of-the-year"], [href*="ai-tool-terms"])',
};
(() => {
  const blocks = [[/^Word Scramble$/, 'h3', '.lcs'], [/^Popular searches$/, 'h2', '.c_ps'], [/^Browse the English Dictionary$/, 'h2', '.bh'], [/^Thesaurus$/, 'h2', '.hbss']];
  const mark = () => {
    for (const [label, tag, box] of blocks) {
      for (const heading of document.querySelectorAll(tag)) {
        if (!label.test(heading.textContent.trim())) continue;
        const block = heading.closest(box);
        if (block && !block.matches('#header, #footer, main, body') && !block.hasAttribute('data-n19-post2019')) block.setAttribute('data-n19-post2019', '');
      }
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; mark(); }); };
  const start = () => { mark(); new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
