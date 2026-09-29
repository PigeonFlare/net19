globalThis.net19Theme = (() => {
  const host = location.hostname;
  const yt = (/^(music|studio|tv|m)\./.exec(host) || [, /^(www\.)?youtube\.com$/.test(host) ? 'www' : 'other'])[1];
  document.documentElement.setAttribute('data-n19-yt', yt);
  return {
    detect: () => document.documentElement.hasAttribute('dark') ? 'dark' : 'light',
    watch: ['dark', 'class'],
    only: () => yt === 'music' ? 'dark' : undefined,
    intended: 'ytd-structured-description-content-renderer #items > [data-net19-hidden]',
  };
})();
(() => {
  const fix = () => {
    if (globalThis.net19Lang?.() === 'en') for (const input of document.querySelectorAll('ytmusic-search-box input')) if (input.placeholder && input.placeholder !== 'Search') input.placeholder = 'Search';
    const masthead = document.querySelector('#masthead, ytd-masthead');
    if (!masthead) return;
    if (globalThis.net19Lang?.() === 'en') for (const input of masthead.querySelectorAll('input[name="search_query"], textarea[name="search_query"], .ytSearchboxComponentInput')) if (input.placeholder !== 'Search') input.placeholder = 'Search';
    for (const node of masthead.querySelectorAll('button, a, yt-button-shape, [role="button"]')) {
      if (/^\s*Ask YouTube\s*$/i.test(node.textContent || '') && !node.closest('[data-net19-hidden]')) node.setAttribute('data-net19-hidden', '');
    }
  };
  const LATER_SECTIONS = /^(?:Featured places|Places|Ask|Explore the podcast|Chapters|Transcript|How this was made|Key concepts|Inferred places)$/;
  const sections = () => {
    for (const item of document.querySelectorAll('ytd-structured-description-content-renderer #items > :not([data-net19-hidden])')) {
      if (item.matches('ytd-video-description-transcript-section-renderer, ytd-horizontal-card-list-renderer:has(ytd-macro-markers-list-item-renderer, macro-markers-panel-item-view-model)')) { item.setAttribute('data-net19-hidden', ''); continue; }
      const headings = item.querySelectorAll('h1, h2, h3, #title, [class*="Title" i], [class*="header" i]');
      if ([...headings].some(heading => LATER_SECTIONS.test(globalThis.net19English((heading.textContent || '').trim())))) item.setAttribute('data-net19-hidden', '');
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
  net19.onBody(start);
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
  if (document.body) { mark(); start(); } else new MutationObserver((_, o) => { if (document.body) { o.disconnect(); mark(); start(); } }).observe(document.documentElement, { childList: true });
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
      about.setAttribute('tab-title', globalThis.net19Say?.('About') ?? 'About');
      about.setAttribute('aria-selected', 'false');
      about.classList.remove('ytTabShapeHostSelected');
      for (const bar of about.querySelectorAll('.ytTabShapeTabBarActive')) bar.classList.remove('ytTabShapeTabBarActive');
      const text = about.querySelector('.ytTabShapeTab');
      if (text) text.textContent = globalThis.net19Say?.('About') ?? 'About';
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
      const parts = [...row.querySelectorAll(':scope > span:not(.n19-sep):not(.n19-break)')].filter(part => !/delimiter|icon/i.test(part.className) && (!part.firstElementChild || part.firstElementChild.tagName === 'SPAN' && part.children.length === 1));
      const texts = parts.map(part => part.textContent.trim());
      if (!texts.some(text => AGO.test(text) || /\bago$/.test(text))) continue;
      parts.forEach((part, i) => {
        const leaf = part.firstElementChild || part;
        if (leaf.firstElementChild) return;
        const text = texts[i];
        const next = spelled(text) || (VIEWS.test(text) ? `${text} views` : null);
        if (next && leaf.textContent !== next) leaf.textContent = next;
      });
      const more = parts.find((part, i) => i > 0 && /^and \S/i.test(part.textContent.trim()));
      if (more) {
        if (!more.hasAttribute('data-net19-hidden')) more.setAttribute('data-net19-hidden', '');
        const views = parts.find(part => /\bviews?$/i.test(part.textContent.trim()));
        if (views && !views.previousElementSibling?.classList.contains('n19-break')) { const cut = document.createElement('span'); cut.className = 'n19-break'; views.before(cut); }
        const cut = row.querySelector(':scope > .n19-break');
        if (cut && more.compareDocumentPosition(cut) & Node.DOCUMENT_POSITION_FOLLOWING) for (let e = more.nextElementSibling; e && e !== cut; e = e.nextElementSibling) if (!e.hasAttribute('data-net19-hidden')) e.setAttribute('data-net19-hidden', '');
        for (let e = more.previousElementSibling; e && (e.classList.contains('n19-sep') || /delimiter/i.test(e.className)); e = e.previousElementSibling) if (!e.hasAttribute('data-net19-hidden')) e.setAttribute('data-net19-hidden', '');
        if (!row.hasAttribute('data-n19-collab')) row.setAttribute('data-n19-collab', '');
      }
      const shown = parts.filter(part => part.getClientRects().length);
      for (let i = 1; i < shown.length; i++) {
        const before = shown[i].previousElementSibling;
        if (before?.classList.contains('n19-break')) continue;
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
  const BEST = [['Music', '/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ', 'M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z'],
    ['Sports', '/channel/UCEgdi0XIXXZ-qJOFPf4JSKw', 'M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z'],
    ['Gaming', '/gaming', 'M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z'],
    ['News', '/channel/UCYfdidRxbB8Qhf0Nx7ioOYw', 'M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM11 17H5v-2h6v2zm0-4H5v-2h6v2zm0-4H5V7h6v2zm8 8h-6V7h6v10z'],
    ['Live', '/channel/UC4R8DWoMoI7CAwX8_LjQHig', 'M16.94 6.91l-1.41 1.45c.9.94 1.46 2.22 1.46 3.64s-.56 2.71-1.46 3.64l1.41 1.45c1.27-1.31 2.05-3.11 2.05-5.09s-.78-3.79-2.05-5.09zM19.77 4l-1.41 1.45C19.98 7.13 21 9.44 21 12.01c0 2.57-1.01 4.88-2.64 6.54l1.4 1.45c2.01-2.04 3.24-4.87 3.24-7.99 0-3.13-1.23-5.96-3.23-8.01zM7.06 6.91c-1.27 1.3-2.05 3.1-2.05 5.09s.78 3.79 2.05 5.09l1.41-1.45c-.9-.94-1.46-2.22-1.46-3.64s.56-2.71 1.46-3.64L7.06 6.91zM5.64 5.45 4.24 4C2.23 6.04 1 8.87 1 11.99c0 3.13 1.23 5.96 3.23 8.01l1.41-1.45C4.02 16.87 3 14.56 3 11.99s1.01-4.88 2.64-6.54zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z']];
  const bestOf = () => {
    const home = document.querySelector('ytd-browse[page-subtype="home"]:not([hidden])');
    const nudge = home?.querySelector('ytd-feed-nudge-renderer #content-wrapper');
    const empty = nudge && !home.querySelector('ytd-rich-item-renderer');
    const shelf = document.querySelector('.n19-best');
    if (!empty) { shelf?.remove(); return; }
    if (shelf?.parentElement === nudge) return;
    const box = document.createElement('div');
    box.className = 'n19-best';
    const heading = net19.say('Best of YouTube');
    if (heading) { const h = document.createElement('h2'); h.textContent = heading; box.append(h); }
    const row = document.createElement('div');
    row.className = 'n19-best-row';
    for (const [label, href, path] of BEST) {
      const a = document.createElement('a');
      a.href = href;
      const circle = document.createElement('span');
      circle.append(icon(path));
      a.append(circle);
      const text = net19.say(label);
      if (text) a.append(document.createTextNode(text));
      a.title = text || '';
      row.append(a);
    }
    box.append(row);
    shelf?.remove();
    nudge.append(box);
  };
  const LIBRARY = /^\s*You\s*$/;
  const guide = () => {
    if (!english()) return;
    for (const title of document.querySelectorAll('ytd-mini-guide-entry-renderer .title, ytd-guide-entry-renderer #endpoint .title, ytd-guide-section-renderer #guide-section-title')) {
      if (LIBRARY.test(title.textContent || '') && !title.querySelector('*')) title.textContent = 'Library';
      else if (/^\s*Explore\s*$/.test(title.textContent || '') && !title.querySelector('*') && title.matches('#guide-section-title')) title.textContent = 'Best of YouTube';
    }
  };
  const run = () => { stats(); channel(); search(); guide(); metadata(); filterLabel(); bestOf(); };
  net19.watch(run, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['aria-label', 'aria-selected', 'hidden'] });
})();
globalThis.net19Theme.words = {"Capítulos": "Chapters", "Ver todo": "View all", "Transcripción": "Transcript", "Sigue la transcripción para no perderte nada.": "Follow along using the transcript.", "Mostrar transcripción": "Show transcript", "Chapitres": "Chapters", "Tout afficher": "View all", "Transcription": "Transcript", "Suivez la vidéo à l'aide de la transcription.": "Follow along using the transcript.", "Afficher la transcription": "Show transcript", "Capitoli": "Chapters", "チャプター": "Chapters", "章节": "Chapters", "챕터": "Chapters", "Главы": "Chapters", "चैप्टर": "Chapters", "الفصول": "Chapters", "Transcrição": "Transcript", "Trascrizione": "Transcript", "文字起こし": "Transcript", "转写文稿": "Transcript", "스크립트": "Transcript", "Текст видео": "Transcript", "ट्रांसक्रिप्ट": "Transcript", "النص": "Transcript"};
