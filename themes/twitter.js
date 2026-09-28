globalThis.net19Theme = {
  detect() {
    const root = document.documentElement;
    const theme = root.getAttribute('data-theme');
    if (theme && !document.getElementById('react-root')) {
      const black = /black|lights/i.test(theme);
      if (black !== root.hasAttribute('data-n19-tw-bg')) black ? root.setAttribute('data-n19-tw-bg', 'black') : root.removeAttribute('data-n19-tw-bg');
      return /dark|dim|black|lights/i.test(theme) ? 'dark' : 'light';
    }
    const bg = getComputedStyle(document.body || root).backgroundColor;
    const [r, g, b, a = 1] = (bg.match(/[\d.]+/g) || [255, 255, 255]).map(Number);
    if (a === 0) return /dark|dim/.test(theme || '') ? 'dark' : 'light';
    const black = r + g + b < 12;
    if (black !== root.hasAttribute('data-n19-tw-bg')) black ? root.setAttribute('data-n19-tw-bg', 'black') : root.removeAttribute('data-n19-tw-bg');
    return .2126 * r + .7152 * g + .0722 * b < 90 ? 'dark' : 'light';
  },
  watch: ['style', 'class', 'data-theme'],
  later: /^(?:grok|ask grok|explain this post|analy[sz]e (?:this )?post|grok actions|profile summary|get verified|subscribe|subscribe to premium|upgrade to premium\+?|premium\+?|verified orgs|creator studio|monetization|communities|spaces|start a space|jobs|articles|business|everyone can reply|schedule|live on x|get the app|download the app)$/i,
  keepLabels: /^(?:messages|home|explore|notifications|bookmarks|lists|profile|more|search|tweet|reply|retweet|like|share)$/i,
};
(() => {
  const EXACT = new Map([
    ['Post', 'Tweet'], ['Posts', 'Tweets'], ['Post all', 'Tweet all'], ['Repost', 'Retweet'], ['Reposts', 'Retweets'], ['Reposted', 'Retweeted'],
    ['Undo repost', 'Undo Retweet'], ['Quote', 'Retweet with comment'], ['Post your reply', 'Tweet your reply'], ['Post your reply!', 'Tweet your reply'],
    ['Trending now', 'What’s happening'], ['Chat', 'Messages'], ['Show more posts', 'Show more Tweets'], ['Show posts', 'Show Tweets'],
    ['Log in or sign up for X', 'New to Twitter?'], ['See what’s happening and join the conversation', 'Sign up now to get your own personalized timeline!'],
    ['Continue with phone', 'Sign up'], ['Log in with username or email', 'Log in'], ['Mention', 'Tweet to'], ['Pinned', 'Pinned Tweet'], ['Search X', 'Search Twitter'], ['Continue to X', 'Continue to Twitter'],
    ['Relevant people', 'Who to follow'], ['See what\'s happening', 'Log in to Twitter'], ['Email or username', 'Phone, email, or username'],
    ['Get App', 'Apps'], ['Careers', 'Jobs'], ['Ads & Business', 'Advertise'], ['Help', 'Help Center'], ['Privacy', 'Privacy Policy'], ['Ads Info', 'Ads info'],
  ]);
  const FOOTER_LATER = /^(?:US TIDA|Accessibility|News|More|More ···|Grok|X Corp\.?|Settings|Status|Blog|Brand Resources)$/;
  const COPYRIGHT = /^©\s*\d{4}\s*X Corp\.?$/;
  const SIGN_IN_WITH = /^(?:(?:continue|sign (?:in|up)|log in) with (?:google|apple|passkey)\.?\s*)+$/i;
  const hideLater = el => { if (el && el.getAttribute('data-n19-tw') !== 'later') el.setAttribute('data-n19-tw', 'later'); };
  const extras = () => {
    for (const nav of document.querySelectorAll('nav[aria-label="Footer"], footer nav')) {
      for (const el of nav.querySelectorAll('a, button, span, div')) {
        if (el.children.length && !(el.matches('a, button'))) continue;
        const text = el.textContent.replace(/\s+/g, ' ').trim();
        if (FOOTER_LATER.test(text)) hideLater(el.matches('a, button') ? el : el.closest('a, button') || el);
        else if (COPYRIGHT.test(text)) { const node = [...el.childNodes].find(n => n.nodeType === 3 && /X Corp/.test(n.nodeValue)); if (node) node.nodeValue = '© 2019 Twitter'; else if (!el.children.length) el.textContent = '© 2019 Twitter'; }
      }
      for (const dot of nav.querySelectorAll('span')) if (dot.textContent.trim() === '·' && dot.previousElementSibling?.getAttribute('data-n19-tw') === 'later') hideLater(dot);
    }
    for (const el of document.querySelectorAll('button, a, [role="button"]')) {
      if (el.getAttribute('data-n19-tw') === 'later') continue;
      const text = el.textContent.replace(/\s+/g, ' ').trim();
      if (SIGN_IN_WITH.test(text) || SIGN_IN_WITH.test(el.getAttribute('aria-label') || '')) hideLater(el);
      else if (/^Trade(?: on .+| \$\S+)?$/.test(el.getAttribute('aria-label') || '')) hideLater(el.closest('[data-timeline-entry]') || el);
    }
    for (const el of document.querySelectorAll('main [aria-label], [role="dialog"] [aria-label]')) { const to = EXACT.get(el.getAttribute('aria-label')); if (to) el.setAttribute('aria-label', to); }
    for (const dialog of document.querySelectorAll('[role="dialog"][aria-label$=" X"]')) dialog.setAttribute('aria-label', dialog.getAttribute('aria-label').replace(/ X$/, ' Twitter'));
    for (const shell of document.querySelectorAll('.jf-gsi-shell, .jf-gsi-face')) hideLater(shell.parentElement?.children.length === 1 ? shell.parentElement : shell);
    for (const root of document.querySelectorAll('.jetfuel-style-root')) {
      for (const p of root.querySelectorAll('p')) {
        const text = p.textContent.trim();
        if (text === 'Select an option below:') hideLater(p.parentElement);
        else if (text === 'or' && !p.closest('button, a, label')) hideLater(p.parentElement?.parentElement);
        else if (text === 'Continue' && p.closest('form') && !p.closest('[data-n19-tw="go"]')) { p.textContent = 'Log in'; p.parentElement?.parentElement?.parentElement?.setAttribute('data-n19-tw', 'wallgo'); }
      }
    }
    for (const entry of document.querySelectorAll('[data-timeline-entry]:not([data-n19-tw])')) {
      if (entry.querySelector('svg[data-icon="icon-clock-instant"]') || [...entry.querySelectorAll('span, div, p')].some(el => !el.children.length && /^(?:Pre-market|After hours) /.test(el.textContent))) hideLater(entry);
    }
    if (document.documentElement.getAttribute('data-n19-ts') === 'out') for (const a of document.querySelectorAll('main a[aria-label="Mention"]')) hideLater(a);
  };
  const COUNT = /^([\d.,]+\s*[KMB]?)\s+posts?$/i;
  const PLACES = '.jetfuel-style-root p, button, a, [role="button"], [role="tab"], [role="menuitem"], [role="link"], [role="heading"], h1, h2, h3, nav, label, [data-testid="User-Name"] ~ div, .public-DraftEditorPlaceholder-inner, [aria-live], aside, header, main > .sticky';
  const SKIP = '[data-testid="tweetText"], article div[dir="auto"], [contenteditable="true"], script, style, input, textarea';
  const rewrite = node => {
    const raw = node.nodeValue, text = raw.replace(/\s+/g, ' ').trim();
    if (!text || text.length > 60) return;
    const el = node.parentElement;
    if (!el || el.closest(SKIP)) return;
    let to = EXACT.get(text);
    if (to === undefined && COUNT.test(text)) to = text.replace(COUNT, '$1 Tweets');
    if (to === undefined && /^posts?$/i.test(text) && COUNT.test(el.textContent.replace(/\s+/g, ' ').trim())) to = 'Tweets';
    if (to === undefined) {
      const tab = el.closest('[role="tab"]');
      if (tab && text === 'Replies' && tab.closest('main [role="tablist"]')) to = 'Tweets & replies';
      else if (tab && tab.closest('[data-n19-tw="hometabs"]')) to = text === 'For you' ? 'Top Tweets' : text === 'Following' ? 'Latest Tweets' : undefined;
    }
    if (to === undefined || !el.closest(PLACES)) return;
    node.nodeValue = raw.replace(text, to);
  };
  const walk = scope => {
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) rewrite(n);
  };
  const marks = () => {
    for (const list of document.querySelectorAll('[data-testid="primaryColumn"] [role="tablist"]:not([data-n19-tw])')) {
      const labels = [...list.querySelectorAll('[role="tab"]')].map(t => t.textContent.trim());
      if (labels.includes('For you') && labels.includes('Following')) { list.setAttribute('data-n19-tw', 'hometabs'); walk(list); }
    }
    for (const label of document.querySelectorAll('main article a[href*="/status/"] > div:last-child')) {
      if (label.textContent.trim() !== 'Views') continue;
      const link = label.parentElement;
      if (link.getAttribute('data-n19-tw') === 'views') continue;
      link.setAttribute('data-n19-tw', 'views');
      const dot = link.previousElementSibling;
      if (dot && dot.textContent.trim() === '·') dot.setAttribute('data-n19-tw', 'views');
    }
    for (const svg of document.querySelectorAll('svg[data-testid="icon-verified"]:not([data-n19-tw-seen])')) {
      svg.setAttribute('data-n19-tw-seen', '');
      const fill = getComputedStyle(svg.querySelector('path') || svg).fill;
      if (/130,\s*154,\s*171/.test(fill) || /130,\s*154,\s*171/.test(getComputedStyle(svg).color)) svg.setAttribute('data-n19-tw', 'badge');
    }
    for (const h of document.querySelectorAll('[data-testid="sidebarColumn"] :is(h2, [role="heading"]), aside section h2')) {
      if (!/^(?:subscribe to premium|live on x|today’s news|today's news|get verified|upgrade to premium\+?|explore|trending with grok|happening now)$/i.test(h.textContent.trim())) continue;
      let module = h;
      while (module.parentElement && [...module.parentElement.children].filter(c => c.querySelector('h2, [role="heading"]')).length < 2) module = module.parentElement;
      if (module && module.parentElement && !module.querySelector('input, textarea, [contenteditable]') && !module.hasAttribute('data-n19-tw')) module.setAttribute('data-n19-tw', 'later');
    }
    for (const button of document.querySelectorAll('[role="dialog"] .jetfuel-style-root button:not([data-n19-tw])')) if (/^(?:sign up|continue with phone)$/i.test(button.textContent.trim())) button.setAttribute('data-n19-tw', 'wallsignup');
    for (const button of document.querySelectorAll('body button:is(:has(img), :has(svg), :has(canvas))')) if (!button.hasAttribute('data-n19-tw') && /^scan to get the app/i.test(button.textContent.trim())) button.setAttribute('data-n19-tw', 'qr');
    for (const input of document.querySelectorAll('[data-testid="SearchBox_Search_Input"], aside input[placeholder="Search"], header input[placeholder="Search"], [role="search"] input[placeholder="Search"]')) {
      if (input.placeholder !== 'Search Twitter') input.placeholder = 'Search Twitter';
    }
    if (/ \/ X$| on X: /.test(document.title)) document.title = document.title.replace(/ \/ X$/, ' / Twitter').replace(/ on X: /, ' on Twitter: ');
    extras();
  };
  const BLUE = { '29,155,240': '#1da1f2', '26,140,216': '#1a91da' };
  const MAPS = {
    light: { fg: { ...BLUE, '15,20,25': '#14171a', '83,100,113': '#657786' }, bg: { ...BLUE, '239,243,244': '#e6ecf0', '247,249,249': '#f5f8fa', '207,217,222': '#ccd6dd' } },
    dim: { fg: { ...BLUE, '247,249,249': '#ffffff', '139,152,165': '#8899a6' }, bg: { ...BLUE, '30,39,50': '#192734', '39,51,64': '#253341' } },
    black: { fg: { ...BLUE, '231,233,234': '#d9d9d9', '113,118,123': '#6e767d' }, bg: { ...BLUE, '22,24,28': '#15181c' } },
  };
  const PROPS = [['color', 'fg'], ['fill', 'fg'], ['stroke', 'fg'], ['background-color', 'bg'], ['border-top-color', 'bg'], ['border-bottom-color', 'bg'], ['border-left-color', 'bg'], ['border-right-color', 'bg']];
  let sheetEl = null, map = null, which = '', done = new WeakSet(), out = [];
  const key = v => { const m = v.match(/[\d.]+/g); if (!m || m.length < 3) return ''; const [r, g, b, a] = m.map(Number); return a === undefined || a === 1 ? `${r},${g},${b}` : `${r},${g},${b},${a}`; };
  const recolor = () => {
    if (!document.getElementById('react-root')) return;
    const root = document.documentElement, mode = root.getAttribute('data-net19-mode');
    const now = mode !== 'dark' ? 'light' : root.hasAttribute('data-n19-tw-bg') ? 'black' : 'dim';
    if (now !== which) { which = now; map = MAPS[now]; done = new WeakSet(); out = []; }
    let added = false;
    for (const sheet of document.styleSheets) {
      if (sheet.ownerNode === sheetEl || !(sheet.ownerNode?.id === 'react-native-stylesheet' || /^\.(?:r|css)-/.test(sheet.cssRules?.[0]?.selectorText || ''))) continue;
      let rules; try { rules = sheet.cssRules; } catch { continue; }
      for (const rule of rules) {
        if (done.has(rule) || !rule.style) continue;
        done.add(rule);
        const decl = [];
        for (const [prop, kind] of PROPS) { const v = rule.style.getPropertyValue(prop); const to = v && map[kind][key(v)]; if (to) decl.push(`${prop}:${to}!important`); }
        if (decl.length) { out.push(`${rule.selectorText}{${decl.join(';')}}`); added = true; }
      }
    }
    if (!sheetEl) { sheetEl = document.createElement('style'); sheetEl.id = 'net19-twitter-colors'; }
    if (!sheetEl.isConnected) (document.head || root).append(sheetEl);
    if (added || sheetEl.textContent === '' && out.length) sheetEl.textContent = out.join('\n');
  };
  let queued = false, pending = [];
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; const roots = pending; pending = []; for (const r of roots) if (r.isConnected) walk(r); marks(); }); };
  const start = () => {
    walk(document.body); marks(); recolor();
    new MutationObserver(records => {
      for (const r of records) {
        if (r.type === 'characterData') { if (r.target.parentElement) pending.push(r.target.parentElement); }
        else for (const n of r.addedNodes) if (n.nodeType === 1) pending.push(n); else if (n.nodeType === 3 && n.parentElement) pending.push(n.parentElement);
      }
      later();
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
    const title = document.querySelector('title');
    if (title) new MutationObserver(later).observe(title, { childList: true, characterData: true, subtree: true });
    setInterval(() => { if (!document.hidden) recolor(); }, 1500);
    new MutationObserver(recolor).observe(document.documentElement, { attributes: true, attributeFilter: ['data-net19-mode', 'data-n19-tw-bg'] });
  };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
(() => {
  const WORDS = new Map([['Happening now', 'See what’s happening in the world right now'], ['Continue with phone', 'Sign up'],
    ['Continue', 'Log in'], ['Email or username', 'Phone, email, or username']]);
  const mark = (el, name) => { if (el && el.getAttribute('data-n19-tw') !== name) el.setAttribute('data-n19-tw', name); };
  const text = el => el.textContent.trim();
  const fix = () => {
    const input = document.querySelector('form input[name^="username"], form input[autocomplete="username"]');
    const form = input?.form || input?.closest('form');
    const h1 = form && [...document.querySelectorAll('h1')].find(h => h.parentElement.contains(form));
    if (!h1) return;
    let col = h1.parentElement;
    while (col?.parentElement && ![...col.parentElement.children].some(c => c !== col && c.querySelector('svg[aria-label="X"], svg[data-icon="icon-logo-x"]'))) col = col.parentElement;
    const row = col?.parentElement;
    if (!row || !row.contains(form)) return;
    mark(row, 'row');
    for (const child of row.children) mark(child, child.contains(form) ? 'main' : 'panel');
    const main = row.querySelector('[data-n19-tw="main"]');
    const panel = row.querySelector('[data-n19-tw="panel"]');
    if (panel && !panel.querySelector('[data-n19-tw="lines"]')) {
      const lines = document.createElement('div');
      lines.setAttribute('data-n19-tw', 'lines');
      lines.setAttribute('aria-hidden', 'true');
      for (const [icon, words] of [['\uf058', 'Follow your interests.'], ['\uf178', 'Hear what people are talking about.'], ['\uf151', 'Join the conversation.']]) {
        const line = document.createElement('div');
        const glyph = document.createElement('span');
        glyph.textContent = icon;
        line.append(glyph, words);
        lines.append(line);
      }
      panel.append(lines);
    }
    mark(h1, 'title');
    if (h1.getAttribute('data-n19-label') !== 'Join Twitter today.') h1.setAttribute('data-n19-label', 'Join Twitter today.');
    const field = input.closest('label') || input.parentElement;
    const go = [...form.querySelectorAll('button, [role="button"], div')].find(el => /^(Continue|Log in)$/.test(text(el)) && !el.querySelector('input'));
    const goBox = go && (go.closest('button, [role="button"]') || [...form.children].find(c => c.contains(go)) || go);
    mark(field, 'field');
    for (const el of field.querySelectorAll('span, div')) if (!el.querySelector('input') && el.textContent.trim()) mark(el, 'cap');
    if (input.placeholder !== 'Phone, email, or username') input.placeholder = 'Phone, email, or username';
    mark(goBox, 'go');
    for (const start of [field, goBox]) for (let n = start?.parentElement; n && n !== main; n = n.parentElement) if (!n.hasAttribute('data-n19-tw')) mark(n, 'static');
    for (const el of main.querySelectorAll('a[href*="/onboarding/"], button, .jf-gsi-face')) {
      if (el.hasAttribute('data-n19-tw') || el.closest('[data-n19-tw="go"]')) continue;
      mark(el, /mode=signup/.test(el.getAttribute('href') || '') || /^Continue with phone$|^Sign up$/.test(text(el)) ? 'signup' : 'alt');
    }
    for (const el of main.querySelectorAll('div')) if (text(el) === 'or' && !el.querySelector('input, button, a')) { mark(el, 'or'); break; }
    const walker = document.createTreeWalker(row, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const to = WORDS.get(node.nodeValue.trim());
      if (to === undefined) continue;
      node.nodeValue = to;
      if (node.parentNode === h1) for (const rest of h1.childNodes) if (rest.nodeType === 3 && rest.nodeValue === '.') rest.nodeValue = '';
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => {
    if (location.pathname !== '/') return;
    fix();
    new MutationObserver(() => { if (location.pathname === '/') later(); }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['placeholder'] });
  };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
(() => {
  const BIRD = 'https://abs.twimg.com/favicons/twitter.2.ico';
  const swap = () => {
    for (const link of document.querySelectorAll('link[rel~="icon"], link[rel="shortcut icon"]')) if (link.href !== BIRD) link.href = BIRD;
  };
  const start = () => { swap(); new MutationObserver(swap).observe(document.head || document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] }); };
  if (document.head) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
(() => {
  const root = document.documentElement;
  const COUNT = /^([\d.,]+\s*[KMB]?)\s+(?:posts?|Tweets?)$/i;
  const HEADINGS = [[/^(?:what’s happening|what's happening|trending now|trends for you|trending|trends)$/i, 'trends'], [/^(?:who to follow|you might like|relevant people)$/i, 'wtf']];
  const setAttr = (el, name, value) => { if (el && el.getAttribute(name) !== value) el.setAttribute(name, value); };
  const mark = (el, name) => setAttr(el, 'data-n19-tl', name);
  const pageKind = main => {
    if (main.querySelector(':scope > div a[href$="/header_photo"], :scope > div a[href$="/photo"] ~ *, :scope > div [role="tablist"] a[href$="/with_replies"]')) return 'profile';
    if (/\/status\/\d+/.test(location.pathname)) return 'status';
    if (/^\/(?:search|explore|hashtag)/.test(location.pathname)) return 'search';
    if (/^\/home/.test(location.pathname)) return 'home';
    return 'page';
  };
  const profileParts = main => {
    const header = [...main.children].find(child => child.getAttribute('data-n19-tl') === 'phead' || (/\bsticky\b/.test(child.className) && !/(?:^|\s)sm:hidden(?:\s|$)/.test(child.className) && child.querySelector('button, a')));
    if (header) mark(header, 'phead');
    const counter = header && [...header.querySelectorAll('div')].find(el => !el.firstElementChild && COUNT.test(el.textContent.replace(/\s+/g, ' ').trim()));
    if (counter) {
      mark(counter, 'tcount');
      setAttr(counter, 'data-n19-count', counter.textContent.replace(/\s+/g, ' ').trim().replace(COUNT, '$1'));
      setAttr(counter, 'data-n19-label', 'Tweets');
    }
    const search = header && header.querySelector('button[aria-label="Search"], a[aria-label="Search"]');
    if (search) { mark(search, 'searchbtn'); setAttr(search, 'data-n19-label', 'Search Twitter'); }
    for (const child of main.children) {
      if (child === header) continue;
      if (child.querySelector(':scope > a[href$="/header_photo"]') || (/\bh-\[200px\]/.test(child.className) && !child.querySelector('article'))) mark(child, 'banner');
      else if (child.querySelector('[role="tablist"]') && child.querySelector('h1')) {
        mark(child, 'pinfo');
        for (const part of child.children) {
          if (part.querySelector('h1')) {
            mark(part, 'pcard');
            const stats = part.querySelector('a[href$="/following"]')?.parentElement;
            if (stats && part.contains(stats) && stats !== part) mark(stats, 'pstats');
            const avatar = part.querySelector('a[href$="/photo"]');
            if (avatar) mark(avatar, 'pavatar');
          } else if (part.querySelector('[role="tablist"]')) mark(part, 'ptabs');
          else if (part.querySelector('button, a')) mark(part, 'pbuttons');
        }
      } else if (child.querySelector('ul, [id^="urt:"], [role="status"]')) mark(child, 'feed');
      else if (child.tagName === 'ASIDE') mark(child, 'gate');
    }
  };
  const layout = () => {
    if (document.getElementById('react-root')) return;
    const main = document.querySelector('body main');
    if (!main) { if (root.hasAttribute('data-n19-tp')) root.removeAttribute('data-n19-tp'); return; }
    const cols = main.parentElement, shell = cols?.parentElement;
    if (!shell || shell === document.body) return;
    const kind = pageKind(main);
    setAttr(root, 'data-n19-tp', kind);
    mark(shell, 'shell'); mark(cols, 'cols');
    const rail = shell.querySelector(':scope > div > aside, :scope > aside');
    if (rail) {
      mark(rail, 'rail');
      if (rail.parentElement !== shell) mark(rail.parentElement, 'railwrap');
      const signedIn = !!rail.querySelector('a[href="/home"], a[href="/notifications"], a[href="/compose/post"]');
      setAttr(root, 'data-n19-ts', signedIn ? 'in' : 'out');
      const logo = rail.querySelector('a[aria-label="X"][href="/"], a[href="/home"]:has(svg[data-icon="icon-logo-x"])');
      if (logo) { mark(logo, 'logo'); setAttr(logo, 'data-n19-label', 'Home'); }
      if (signedIn) for (const a of rail.querySelectorAll('a[href], button')) {
        if (a.querySelector('img[alt^="@"], img[alt="Avatar"]') && !a.closest('nav')) mark(a, 'me');
        else if (/^\/compose\/post/.test(a.getAttribute('href') || '')) mark(a, 'tweetbtn');
      }
    }
    const right = cols.querySelector(':scope > aside');
    if (right) {
      mark(right, 'right');
      const login = [...right.querySelectorAll('a[href*="mode=login"]')].find(a => a.querySelector('svg[data-icon="icon-at"]') || /^log in/i.test(a.textContent.trim()));
      if (login) { mark(login, 'login'); setAttr(login, 'data-n19-label', 'Have an account?'); }
      for (const el of right.querySelectorAll('div, span')) if (el.textContent.trim() === 'or' && !el.querySelector('a, button') && el.children.length) { mark(el, 'or'); break; }
      const form = right.querySelector('form[role="search"], [role="search"]');
      if (form) mark(form, 'searchform');
      for (const h of right.querySelectorAll('h2, [role="heading"]')) {
        const kindOf = HEADINGS.find(([test]) => test.test(h.textContent.trim()));
        const section = h.closest('section, [role="region"]');
        if (kindOf && section) mark(section, kindOf[1]);
        if (kindOf?.[1] === 'trends') {
          const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
          for (let node = walker.nextNode(); node; node = walker.nextNode()) if (/^(?:what’s happening|what's happening|trending now)$/i.test(node.nodeValue.trim())) node.nodeValue = 'Trends for you';
        }
      }
    }
    if (kind === 'profile') profileParts(main);
    else {
      for (const child of main.children) {
        if (/\bsticky\b/.test(child.className) && !/(?:^|\s)sm:hidden(?:\s|$)/.test(child.className) && !child.querySelector('article')) mark(child, 'mhead');
        else if (child.tagName === 'ASIDE') mark(child, 'gate');
        else if (child.querySelector('ul, [id^="urt:"], [role="status"], article')) mark(child, 'feed');
      }
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; layout(); }); };
  const start = () => {
    layout();
    new MutationObserver(later).observe(document.body, { childList: true, subtree: true });
    globalThis.navigation?.addEventListener?.('navigatesuccess', later);
  };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
