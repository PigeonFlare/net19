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
  const LATER_SECTIONS = /^(?:Featured places|Places|Ask)$/;
  const sections = () => {
    for (const item of document.querySelectorAll('ytd-structured-description-content-renderer #items > :not([data-net19-hidden])')) {
      const headings = item.querySelectorAll('h1, h2, h3, #title, [class*="Title" i], [class*="header" i]');
      if ([...headings].some(heading => LATER_SECTIONS.test((heading.textContent || '').trim()))) item.setAttribute('data-net19-hidden', '');
    }
  };
  const comments = () => {
    for (const button of document.querySelectorAll('ytd-watch-metadata ytd-text-inline-expander #expand')) {
      for (const node of button.childNodes) if (node.nodeType === 3 && /^\s*(?:(?:\.{3}|…)\s*)?more\s*$/i.test(node.data)) node.data = 'Show more';
    }
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
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); comments(); sections(); }); };
  const start = () => {
    fix(); comments(); sections();
    new MutationObserver(later).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['placeholder'] });
  };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
(() => {
  if (!/^(www\.)?youtube\.com$/.test(location.hostname)) return;
  const toWatch = () => {
    const m = /^\/shorts\/([\w-]{6,})/.exec(location.pathname);
    if (m) location.replace(`/watch?v=${m[1]}`);
    else if (/^\/shorts\/?$/.test(location.pathname)) location.replace('/');
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
(() => {
  if (!/^(www\.)?youtube\.com$/.test(location.hostname)) return;
  const english = () => /^en\b/i.test(document.documentElement.lang || 'en');
  const own = (parent, className, tag = 'div') => {
    let node = parent.querySelector(`:scope > .${className}`);
    if (!node) { node = document.createElement(tag); node.className = className; parent.append(node); }
    return node;
  };
  const setText = (node, text) => { if (node.textContent !== text) node.textContent = text; };
  const digits = label => (/\d[\d.,\u00a0\u202f ]*\d|\d/.exec(label || '') || [''])[0].trim();
  const published = date => !english() || /^(Premiered|Streamed|Scheduled|Started|Published)\b/i.test(date) ? date : `Published on ${date}`;
  const stats = () => {
    for (const meta of document.querySelectorAll('ytd-watch-flexy ytd-watch-metadata')) {
      const fold = meta.querySelector('#above-the-fold');
      const inner = meta.querySelector('#description-inner');
      const tip = meta.querySelector('ytd-watch-info-text tp-yt-paper-tooltip #tooltip');
      const parts = (tip?.textContent || '').split(/\s+[•·]\s+/).map(part => part.trim()).filter(Boolean);
      if (!fold || !inner || parts.length < 2 || !/\d/.test(parts[0])) { meta.removeAttribute('data-n19-stats'); continue; }
      setText(own(fold, 'n19-views'), parts[0]);
      const date = own(inner, 'n19-published');
      setText(date, published(parts.slice(1).filter(part => !part.startsWith('#')).join(' • ')));
      if (inner.firstElementChild !== date) inner.prepend(date);
      const subs = meta.querySelector('#owner-sub-count');
      const count = /^\s*([\d.,\u00a0\u202f]+\s?[KMB]?)\s+subscribers?\s*$/i.exec(subs?.textContent || '');
      const box = own(fold, 'n19-subs', 'span');
      setText(box, count ? count[1] : '');
      box.toggleAttribute('hidden', !count);
      meta.toggleAttribute('data-n19-subs', !!count);
      meta.setAttribute('data-n19-stats', '');
      for (const button of meta.querySelectorAll('#actions like-button-view-model button[aria-label]')) {
        const text = button.querySelector('.ytSpecButtonShapeNextButtonTextContent');
        const exact = digits(button.getAttribute('aria-label'));
        if (text && exact && !text.firstElementChild && /\d/.test(text.textContent)) setText(text, exact);
      }
    }
  };
  const channel = () => {
    for (const header of document.querySelectorAll('ytd-browse[page-subtype="channels"] yt-page-header-view-model')) {
      const actions = header.querySelector('yt-flexible-actions-view-model');
      if (!actions) continue;
      const part = [...header.querySelectorAll('yt-content-metadata-view-model .ytContentMetadataViewModelMetadataText')].map(node => node.textContent.trim()).find(text => /subscribers?$/i.test(text)) || '';
      const count = /^([\d.,\u00a0\u202f]+\s?[KMB]?)\s+subscribers?$/i.exec(part);
      const box = own(actions, 'n19-subs', 'span');
      setText(box, count ? count[1] : '');
      box.toggleAttribute('hidden', !count);
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; stats(); channel(); }); };
  const start = () => { stats(); channel(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['aria-label'] }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
