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
(() => {
  const fix = () => {
    for (const input of document.querySelectorAll('ytmusic-search-box input')) if (input.placeholder && input.placeholder !== 'Search') input.placeholder = 'Search';
    const masthead = document.querySelector('#masthead, ytd-masthead');
    if (!masthead) return;
    for (const input of masthead.querySelectorAll('input[name="search_query"]')) if (input.placeholder !== 'Search') input.placeholder = 'Search';
    for (const node of masthead.querySelectorAll('button, a, yt-button-shape, [role="button"]')) {
      if (/^\s*Ask YouTube\s*$/i.test(node.textContent || '') && !node.closest('[data-net19-hidden]')) node.setAttribute('data-net19-hidden', '');
    }
  };
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
(() => {
  if (!/^(www\.)?youtube\.com$/.test(location.hostname)) return;
  const toWatch = () => {
    const m = /^\/shorts\/([\w-]{6,})/.exec(location.pathname);
    if (m) location.replace(`/watch?v=${m[1]}`);
  };
  toWatch();
  document.addEventListener('yt-navigate-finish', toWatch);
  addEventListener('popstate', toWatch);
  const SHORTS = /^\s*Shorts\s*$/i;
  const mark = () => {
    for (const el of document.querySelectorAll('ytd-search-filter-renderer, yt-chip-cloud-chip-renderer, chip-view-model')) {
      if (!el.hasAttribute('data-net19-hidden') && SHORTS.test(el.textContent || '')) el.setAttribute('data-net19-hidden', '');
    }
  };
  let queued = false;
  const start = () => new MutationObserver(() => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; mark(); }); })
    .observe(document.body, { childList: true, subtree: true });
  if (document.body) { mark(); start(); } else document.addEventListener('DOMContentLoaded', () => { mark(); start(); }, { once: true });
})();
