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
    for (const input of masthead.querySelectorAll('input[name="search_query"], textarea[name="search_query"], .ytSearchboxComponentInput')) if (input.placeholder !== 'Search') input.placeholder = 'Search';
    for (const node of masthead.querySelectorAll('button, a, yt-button-shape, [role="button"]')) {
      if (/^\s*Ask YouTube\s*$/i.test(node.textContent || '') && !node.closest('[data-net19-hidden]')) node.setAttribute('data-net19-hidden', '');
    }
  };
  const LATER_SECTIONS = /^(?:Featured places|Places|Ask|Explore the podcast|Chapters|Transcript|How this was made|Key concepts|Inferred places)$/;
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
  const SVG = 'http://www.w3.org/2000/svg';
  const english = () => /^en\b/i.test(document.documentElement.lang || 'en');
  const own = (parent, className, tag = 'div', first = false) => {
    let node = parent.querySelector(`:scope > .${className}`);
    if (!node) { node = document.createElement(tag); node.className = className; if (first) parent.prepend(node); else parent.append(node); }
    return node;
  };
  const setText = (node, text) => { if (node.textContent !== text) node.textContent = text; };
  const digits = label => (/\d[\d.,   ]*\d|\d/.exec(label || '') || [''])[0].trim();
  const COUNT = /^\s*([\d.,  ]+\s?[KMB]?)\s+subscribers?\s*$/i;
  const icon = path => {
    const svg = document.createElementNS(SVG, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    const p = document.createElementNS(SVG, 'path');
    p.setAttribute('d', path);
    svg.append(p);
    return svg;
  };
  const countInButton = (scope, count) => {
    const button = scope?.querySelector(':is(button, a).ytSpecButtonShapeNextHost[aria-label^="Subscribe" i], :is(button, a).ytSpecButtonShapeNextHost[aria-label*="Subscribed" i], :is(button, a).ytSpecButtonShapeNextHost[aria-label^="Unsubscribe" i]');
    const text = button?.querySelector('.ytSpecButtonShapeNextButtonTextContent');
    if (!text) return false;
    const box = own(text, 'n19-count', 'span');
    setText(box, count || '');
    box.toggleAttribute('hidden', !count);
    return !!count;
  };
  const stats = () => {
    for (const meta of document.querySelectorAll('ytd-watch-flexy ytd-watch-metadata')) {
      const fold = meta.querySelector('#above-the-fold');
      const tip = meta.querySelector('ytd-watch-info-text tp-yt-paper-tooltip #tooltip');
      const parts = (tip?.textContent || '').split(/\s+[•·]\s+/).map(part => part.trim()).filter(Boolean);
      if (!fold || parts.length < 2 || !/\d/.test(parts[0])) { meta.removeAttribute('data-n19-stats'); continue; }
      const date = (parts.slice(1).find(part => /\d/.test(part) && !part.startsWith('#')) || '').replace(/^(Premiered|Streamed live on|Published on)\s+/i, '');
      setText(own(fold, 'n19-views'), date ? `${parts[0]} • ${date}` : parts[0]);
      meta.setAttribute('data-n19-stats', '');
      const count = COUNT.exec(meta.querySelector('#owner-sub-count')?.textContent || '');
      meta.toggleAttribute('data-n19-subs', countInButton(meta.querySelector('#subscribe-button'), count ? count[1] : ''));
      for (const button of meta.querySelectorAll('#actions like-button-view-model button[aria-label]')) {
        const text = button.querySelector('.ytSpecButtonShapeNextButtonTextContent');
        const exact = digits(button.getAttribute('aria-label'));
        if (text && exact && !text.firstElementChild && /\d/.test(text.textContent)) setText(text, exact);
      }
    }
  };
  const channelHeader = header => {
    const rows = [...header.querySelectorAll('yt-content-metadata-view-model .ytContentMetadataViewModelMetadataRow')];
    let count = '';
    for (const row of rows) {
      for (const part of row.querySelectorAll(':scope > span, :scope > a, :scope > .ytContentMetadataViewModelMetadataText')) {
        const text = part.textContent.trim();
        const kind = /^@/.test(text) ? 'handle' : /subscribers?$/i.test(text) ? 'subscribers' : /videos?$/i.test(text) ? 'videos' : '';
        if (kind && part.getAttribute('data-n19-part') !== kind) part.setAttribute('data-n19-part', kind);
        if (kind === 'subscribers') count = (COUNT.exec(text) || [])[1] || '';
      }
    }
    countInButton(header.querySelector('yt-flexible-actions-view-model'), count);
  };
  const TAB_NAMES = { posts: 'Community' };
  const tabs = browse => {
    const group = browse.querySelector('ytd-tabbed-page-header yt-tab-group-shape');
    if (!group) return;
    for (const tab of group.querySelectorAll('yt-tab-shape')) {
      const title = (tab.getAttribute('tab-title') || '').toLowerCase();
      const label = tab.querySelector('.ytTabShapeTab');
      if (english() && TAB_NAMES[title] && label && !label.firstElementChild) setText(label, TAB_NAMES[title]);
    }
    const preview = browse.querySelector('yt-page-header-view-model yt-description-preview-view-model');
    const tabList = group.querySelector('[role="tablist"]') || group;
    const last = [...tabList.querySelectorAll(':scope > yt-tab-shape[tab-title]:not(.n19-about)')].filter(tab => tab.getAttribute('tab-title')).pop();
    let about = tabList.querySelector(':scope > yt-tab-shape.n19-about');
    if (!preview || !last) { about?.remove(); return; }
    if (!about) {
      about = last.cloneNode(true);
      about.classList.add('n19-about');
      about.removeAttribute('tab-identifier');
      about.setAttribute('tab-title', 'About');
      about.setAttribute('aria-selected', 'false');
      about.classList.remove('ytTabShapeHostSelected');
      for (const bar of about.querySelectorAll('.ytTabShapeTabBarActive')) bar.classList.remove('ytTabShapeTabBarActive');
      const text = about.querySelector('.ytTabShapeTab');
      if (text) text.textContent = 'About';
      about.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        const target = browse.querySelector('yt-page-header-view-model yt-description-preview-view-model :is(.truncated-text-wiz__absolute-button, button, [role="button"], .ytTruncatedTextAbsoluteButton)')
          || browse.querySelector('yt-page-header-view-model yt-description-preview-view-model');
        target?.click();
      }, true);
      last.after(about);
    } else if (last.nextElementSibling !== about) last.after(about);
  };
  const SORTS = { latest: 'Date added (newest)', popular: 'Most popular', oldest: 'Date added (oldest)' };
  const uploads = browse => {
    const grid = browse.querySelector('ytd-two-column-browse-results-renderer ytd-rich-grid-renderer');
    const selected = (browse.querySelector('yt-tab-shape[aria-selected="true"]')?.getAttribute('tab-title') || '').toLowerCase();
    const bar = grid?.querySelector(':scope > #header');
    const existing = grid?.querySelector(':scope > .n19-uploads');
    if (!grid || selected !== 'videos') { existing?.remove(); return; }
    const chips = [...(bar?.querySelectorAll('chip-view-model, yt-chip-cloud-chip-renderer') || [])];
    const box = existing || document.createElement('div');
    if (!existing) {
      box.className = 'n19-uploads';
      const title = document.createElement('span');
      title.className = 'n19-uploads-title';
      title.textContent = 'Uploads';
      const play = document.createElement('a');
      play.className = 'n19-play-all';
      play.append(icon('M8 5v14l11-7z'), document.createTextNode('Play all'));
      const spacer = document.createElement('span');
      spacer.className = 'n19-spacer';
      const sort = document.createElement('div');
      sort.className = 'n19-sort';
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.append(icon('M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z'), document.createTextNode('Sort by'));
      const menu = document.createElement('div');
      menu.className = 'n19-sort-menu';
      menu.setAttribute('role', 'menu');
      menu.hidden = true;
      toggle.addEventListener('click', () => { menu.hidden = !menu.hidden; });
      document.addEventListener('click', event => { if (!sort.contains(event.target)) menu.hidden = true; }, true);
      sort.append(toggle, menu);
      box.append(title, play, spacer, sort);
      if (bar) bar.after(box); else grid.prepend(box);
    }
    const id = (document.querySelector('link[rel="canonical"]')?.href || '').match(/\/channel\/UC([\w-]{22})/);
    const play = box.querySelector('.n19-play-all');
    if (id) { const href = `/playlist?list=UU${id[1]}`; if (play.getAttribute('href') !== href) play.setAttribute('href', href); play.hidden = false; } else play.hidden = true;
    const menu = box.querySelector('.n19-sort-menu');
    const sort = box.querySelector('.n19-sort');
    sort.hidden = !chips.length;
    const labels = chips.map(chip => (chip.textContent || '').trim());
    if (menu.dataset.labels !== labels.join('|')) {
      menu.dataset.labels = labels.join('|');
      menu.replaceChildren(...chips.map((chip, i) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.setAttribute('role', 'menuitemradio');
        item.textContent = english() ? SORTS[labels[i].toLowerCase()] || labels[i] : labels[i];
        item.addEventListener('click', () => {
          const live = [...(grid.querySelector(':scope > #header')?.querySelectorAll('chip-view-model, yt-chip-cloud-chip-renderer') || [])].find(c => (c.textContent || '').trim() === labels[i]);
          (live?.querySelector('button, [role="tab"], [role="button"]') || live)?.click();
          menu.hidden = true;
        });
        return item;
      }));
    }
    chips.forEach((chip, i) => {
      const on = !!chip.querySelector('[aria-selected="true"], [aria-pressed="true"], .ytChipShapeActive') || chip.hasAttribute('selected');
      menu.children[i]?.setAttribute('aria-checked', String(on));
    });
  };
  const channel = () => {
    for (const browse of document.querySelectorAll('ytd-browse[page-subtype="channels"]:not([hidden])')) {
      const header = browse.querySelector('yt-page-header-view-model');
      if (header) channelHeader(header);
      tabs(browse);
      uploads(browse);
    }
  };
  const search = () => {
    for (const video of document.querySelectorAll('ytd-search ytd-video-renderer')) {
      const meta = video.querySelector('.text-wrapper > #meta');
      const block = meta?.querySelector(':scope > ytd-video-meta-block');
      if (!block) continue;
      const dot = own(meta, 'n19-dot', 'span');
      setText(dot, '•');
      if (dot.nextElementSibling !== block) block.before(dot);
    }
  };
  const UNITS = { s: 'second', m: 'minute', h: 'hour', d: 'day', w: 'week', mo: 'month', y: 'year' };
  const AGO = /^(\d+)\s?(s|m|h|d|w|mo|y) ago$/;
  const VIEWS = /^[\d.,]+\s?[KMB]?$/;
  const spelled = text => {
    const t = text.trim();
    const ago = AGO.exec(t);
    if (ago) return `${ago[1]} ${UNITS[ago[2]]}${ago[1] === '1' ? '' : 's'} ago`;
    return null;
  };
  const metadata = () => {
    if (!english()) return;
    for (const row of document.querySelectorAll('ytd-video-meta-block #metadata-line, yt-content-metadata-view-model .ytContentMetadataViewModelMetadataRow')) {
      const parts = [...row.querySelectorAll(':scope > span:not(.n19-sep)')].filter(part => !/delimiter/i.test(part.className) && (!part.firstElementChild || part.firstElementChild.tagName === 'SPAN' && part.children.length === 1));
      const texts = parts.map(part => part.textContent.trim());
      if (!texts.some(text => AGO.test(text) || /\bago$/.test(text))) continue;
      parts.forEach((part, i) => {
        const leaf = part.firstElementChild || part;
        if (leaf.firstElementChild) return;
        const text = texts[i];
        const next = spelled(text) || (VIEWS.test(text) ? `${text} views` : null);
        if (next && leaf.textContent !== next) leaf.textContent = next;
      });
      const shown = parts.filter(part => part.getClientRects().length);
      for (let i = 1; i < shown.length; i++) {
        const before = shown[i].previousElementSibling;
        if (before && before !== shown[i - 1] && (before.classList.contains('n19-sep') || before.textContent.trim() === '•')) continue;
        if (getComputedStyle(shown[i - 1], '::after').content.includes('•') || getComputedStyle(shown[i], '::before').content.includes('•')) continue;
        if (before && before !== shown[i - 1] && /delimiter/i.test(before.className)) { if (before.textContent !== '•') before.textContent = '•'; before.classList.add('n19-sep'); continue; }
        const sep = document.createElement('span');
        sep.className = 'n19-sep';
        sep.textContent = '•';
        shown[i].before(sep);
      }
    }
    for (const badge of document.querySelectorAll('yt-content-metadata-view-model .ytContentMetadataViewModelMetadataRow, ytd-badge-supported-renderer badge-shape')) {
      if (/^(?:Dubbed|Auto-dubbed)$/i.test((badge.textContent || '').trim()) && !badge.hasAttribute('data-net19-hidden')) badge.setAttribute('data-net19-hidden', '');
    }
  };
  const filterLabel = () => {
    if (!english()) return;
    for (const text of document.querySelectorAll('ytd-search-header-renderer #filter-button .ytSpecButtonShapeNextButtonTextContent, ytd-search-header-renderer #filter-button .ytSpecButtonShapeNextButtonTextContent span')) if (/^\s*Filters\s*$/.test(text.textContent) && !text.firstElementChild) text.textContent = 'Filter';
  };
  const LIBRARY = /^\s*You\s*$/;
  const guide = () => {
    if (!english()) return;
    for (const title of document.querySelectorAll('ytd-mini-guide-entry-renderer .title, ytd-guide-entry-renderer #endpoint .title, ytd-guide-section-renderer #guide-section-title')) {
      if (LIBRARY.test(title.textContent || '') && !title.querySelector('*')) title.textContent = 'Library';
      else if (/^\s*Explore\s*$/.test(title.textContent || '') && !title.querySelector('*') && title.matches('#guide-section-title')) title.textContent = 'Best of YouTube';
    }
  };
  let queued = false;
  const run = () => { stats(); channel(); search(); guide(); metadata(); filterLabel(); };
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; run(); }); };
  const start = () => { run(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['aria-label', 'aria-selected', 'hidden'] }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
