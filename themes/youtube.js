// net19 handmade theme: YouTube, 2019. YouTube marks its dark theme with html[dark]; both modes are restyled.
// YouTube Music was a dark-only app in 2019, so it stays dark on a light device. Each YouTube
// property is marked on <html data-n19-yt="www|music|studio|tv|m|other"> so page rules can be scoped to it.
globalThis.net19Theme = (() => {
  const host = location.hostname;
  const yt = (/^(music|studio|tv|m)\./.exec(host) || [, /^(www\.)?youtube\.com$/.test(host) ? 'www' : 'other'])[1];
  document.documentElement.setAttribute('data-n19-yt', yt);
  return {
    detect: () => document.documentElement.hasAttribute('dark') ? 'dark' : 'light',
    watch: ['dark', 'class'],
    only: () => yt === 'music' ? 'dark' : undefined,
  };
})();
// Text that did not exist in 2019, changed in place: the search field said "Search" (not "Search or ask a question"),
// and "Ask YouTube" (an assistant entry point with no stable label) is hidden by its visible text.
(() => {
  const fix = () => {
    // YouTube Music's field said just "Search" in 2019
    for (const input of document.querySelectorAll('ytmusic-search-box input')) if (input.placeholder && input.placeholder !== 'Search') input.placeholder = 'Search';
    const masthead = document.querySelector('#masthead, ytd-masthead');
    if (!masthead) return;
    for (const input of masthead.querySelectorAll('input[name="search_query"]')) if (input.placeholder !== 'Search') input.placeholder = 'Search';
    for (const node of masthead.querySelectorAll('button, a, yt-button-shape, [role="button"]')) {
      if (/^\s*Ask YouTube\s*$/i.test(node.textContent || '') && !node.closest('[data-net19-hidden]')) node.setAttribute('data-net19-hidden', '');
    }
  };
  // Comments: 2019 showed display names, not @handles (2022), and folded replies under "View 12 replies".
  const comments = () => {
    for (const span of document.querySelectorAll('ytd-comment-view-model #author-text span, ytd-comment-view-model #header-author #channel-name #text')) {
      const t = span.textContent;
      if (/^\s*@/.test(t) && !span.querySelector('*')) span.textContent = t.replace(/^(\s*)@/, '$1');
    }
    for (const span of document.querySelectorAll('ytw-pinned-comment-badge-renderer .ytAttributedStringHost')) {
      if (/^Pinned by @/.test(span.textContent) && !span.querySelector('*')) span.textContent = span.textContent.replace('Pinned by @', 'Pinned by ');
    }
    for (const span of document.querySelectorAll('ytd-comment-replies-renderer :is(#more-replies, #more-replies-sub-thread) .ytAttributedStringHost')) {
      const t = span.textContent.trim();
      if (/^[\d.,]+[KMB]?\s+repl(?:y|ies)$/i.test(t)) span.textContent = 'View ' + t;
    }
  };
  // The search field is focused on any click in its box, whatever variant YouTube draws around it.
  document.addEventListener('pointerup', event => {
    const box = event.target instanceof Element && event.target.closest('yt-searchbox');
    if (!box || event.target.closest('button, a, [role="option"], [role="listbox"]')) return;
    const field = box.querySelector('input[name="search_query"], textarea[name="search_query"]');
    setTimeout(() => { if (field && document.activeElement !== field) field.focus(); }, 0);
  }, true);
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); comments(); }); };
  const start = () => {
    fix(); comments();
    new MutationObserver(later).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['placeholder'] });
  };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
// Shorts (2020) did not exist in 2019: a Short opens as an ordinary video on the watch page, whether it is reached by an
// address or by a click inside YouTube's single-page app.
(() => {
  if (!/^(www\.)?youtube\.com$/.test(location.hostname)) return;
  const toWatch = () => {
    const m = /^\/shorts\/([\w-]{6,})/.exec(location.pathname);
    if (m) location.replace(`/watch?v=${m[1]}`);
  };
  toWatch();
  document.addEventListener('yt-navigate-finish', toWatch);
  addEventListener('popstate', toWatch);
})();
