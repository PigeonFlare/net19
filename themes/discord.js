globalThis.net19Theme = {
  detect: () => {
    const root = document.documentElement;
    if (root.hasAttribute('data-wf-site')) return location.pathname === '/' ? 'dark' : 'light';
    if (globalThis.net19Theme.only() === 'dark') return 'dark';
    const list = root.classList;
    if (!['theme-light', 'theme-dark', 'theme-darker', 'theme-midnight'].some(name => list.contains(name))) return null;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },
  watch: ['class'],
  only: () => document.documentElement.hasAttribute('data-wf-site') && location.pathname === '/' || /^\/(?:login|register|invite\/|gift\/|reset|verify|activate|oauth2\/authorize)/.test(location.pathname) ? 'dark' : undefined,
  later: /^(?:quests?|shop|discover|explore discoverable servers|start an activity|activities|apps|use apps|create poll|create thread|add super reaction|super reactions?|summaries|forward|server guide|browse channels|channels & roles|open gif picker|open sticker picker|record voice message|send voice message|set a server tag|server tags?|avatar decorations?|nameplates?|profile effects?)$/i,
};
(() => {
  if (document.documentElement.hasAttribute('data-wf-site') || /^\/(?:login|register|invite\/|gift\/|reset|verify|activate|oauth2\/authorize)/.test(location.pathname)) return;
  const DARK_CLASS = /\.theme-(?:dark|darker|midnight)(?![\w-])/;
  const LIGHT_CLASS = /\.theme-light(?![\w-])/g;
  const DARK_CLASSES = /\.theme-(?:dark|darker|midnight)(?![\w-])/g;
  let sheetEl = null, built = '', seen = 0;
  const collect = mode => {
    const out = [];
    const walk = (rules, wrap) => {
      for (const rule of rules) {
        if (rule.cssRules && !rule.selectorText) {
          const cond = rule.conditionText || rule.media?.mediaText;
          if (rule.constructor.name === 'CSSMediaRule' || rule.constructor.name === 'CSSSupportsRule') walk(rule.cssRules, text => wrap(`@${rule.constructor.name === 'CSSMediaRule' ? 'media' : 'supports'} ${cond}{${text}}`));
          else if (rule.constructor.name === 'CSSLayerBlockRule') walk(rule.cssRules, wrap);
          continue;
        }
        const sel = rule.selectorText;
        if (!sel || !rule.style?.length) continue;
        let to = '';
        if (mode === 'light' && /\.theme-light(?![\w-])/.test(sel) && !DARK_CLASS.test(sel)) to = sel.replace(LIGHT_CLASS, ':is(.theme-dark, .theme-darker, .theme-midnight):not(#n19-none)');
        else if (mode === 'dark' && DARK_CLASS.test(sel) && !/\.theme-light(?![\w-])/.test(sel) && !/\.theme-(?:darker|midnight)(?![\w-])/.test(sel)) to = sel.replace(DARK_CLASSES, '.theme-light:not(#n19-none)');
        if (to) out.push(wrap(`${to}{${rule.style.cssText}}`));
      }
    };
    for (const sheet of document.styleSheets) {
      if (sheet.ownerNode === sheetEl) continue;
      let rules; try { rules = sheet.cssRules; } catch { continue; }
      walk(rules, text => text);
    }
    return out.join('\n');
  };
  const update = () => {
    const root = document.documentElement;
    const mode = root.getAttribute('data-net19-mode');
    const siteDark = ['theme-dark', 'theme-darker', 'theme-midnight'].some(name => root.classList.contains(name));
    const needed = mode === 'light' && siteDark ? 'light' : mode === 'dark' && root.classList.contains('theme-light') ? 'dark' : '';
    const count = document.styleSheets.length;
    const key = `${needed}|${count}`;
    if (key === built) return;
    built = key;
    if (!sheetEl) { sheetEl = document.createElement('style'); sheetEl.id = 'net19-discord-own-theme'; }
    const text = needed ? collect(needed) : '';
    if (sheetEl.textContent !== text) sheetEl.textContent = text;
    if (!sheetEl.isConnected) (document.head || root).prepend(sheetEl);
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; update(); }); };
  const start = () => {
    update();
    new MutationObserver(later).observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-net19-mode'] });
    if (document.head) new MutationObserver(later).observe(document.head, { childList: true });
    addEventListener('load', later, { once: true });
  };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
(() => {
  if (!/^\/(?:$|download|nitro|safety|company|blog|careers|developers|servers|community)/.test(location.pathname)) return;
  const LATER = /^(?:discover|quests|safety|blog)$/i;
  const WORDS = new Map([
    ['Group chat that’s all fun & games', 'It’s time to ditch Skype and TeamSpeak.'],
    ['Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.', 'All-in-one voice and text chat for gamers that’s free, secure, and works on both your desktop and phone. Stop paying for TeamSpeak servers and hassling with Skype. Simplify your life.'],
    ['Careers', 'Jobs'], ['Log In', 'Login'], ['Brand', 'Branding'], ['Official 3rd Party Merch', 'Merch Store'],
    ['YOU CAN\'T SCROLL ANYMORE.BETTER GO CHAT.', 'Ready to try Discord? It\'s free!'],
  ]);
  const rewrite = () => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.nodeValue.replace(/\s+/g, ' ').trim();
      if (!text || text.length > 200) continue;
      const to = WORDS.get(text) ?? WORDS.get(node.parentElement?.textContent.replace(/\s+/g, ' ').trim());
      if (to === undefined) continue;
      if (WORDS.has(text)) node.nodeValue = to;
      else if (node === node.parentElement.firstChild) { node.parentElement.textContent = to; }
    }
  };
  const DROPDOWN_LATER = /^(?:Official Game Communities|Social Commerce|Discord for Game Developers|Quests|Discord Quests|Activities|Embedded App SDK|Social SDK|App Directory|Safety Center|Family Center|Creators)(?:\s*\d+ of \d+)?$/i;
  const fix = () => {
    rewrite();
    for (const link of document.querySelectorAll('.nav_dd_link_list a, .nav_dd a')) {
      if (!link.hasAttribute('data-net19-hidden') && DROPDOWN_LATER.test(link.textContent.replace(/\s+/g, ' ').trim())) link.setAttribute('data-net19-hidden', '');
    }
    for (const title of document.querySelectorAll('.nav_menu .menu-title, .nav_dd .menu-title, .nav_burger .menu-title')) {
      if (!LATER.test(title.textContent.trim())) continue;
      const item = title.closest('li, .nav_dd');
      if (item && !item.hasAttribute('data-net19-hidden')) item.setAttribute('data-net19-hidden', '');
    }
    for (const band of document.querySelectorAll('.home--hero, .discord_banner, header.nav')) if (!band.hasAttribute('data-net19-keep')) band.setAttribute('data-net19-keep', '');
  };
  const start = () => {
    fix();
    new MutationObserver(fix).observe(document.body, { childList: true, subtree: true });
    new MutationObserver(() => requestAnimationFrame(fix)).observe(document.documentElement, { attributes: true, attributeFilter: ['data-net19-flip'] });
  };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
