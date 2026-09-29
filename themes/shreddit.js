globalThis.net19Theme = {
  detect: () => document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light',
  watch: ['class'],
  later: /^(?:open chat|chat|chats|start chat|answers|reddit answers|ask|ask reddit answers|new answers|get (?:the )?app|get the reddit app|scan (?:this|the) qr code.*|edit avatar|create avatar|style avatar|avatar|collectible avatars|collectibles|vault|achievements|view achievements|reddit recap|recap|reddit pro|try reddit pro(?:\s*beta)?|contributor program|earn|advertise on reddit|advertise|translate|translate to english|show original|view translation|translations?|see translation|auto-translate)$/i,
  keepLabels: /^(?:askreddit|r\/ask\w*)$/i,
};
(() => {
  const POST = `
    [data-testid="action-row"] { gap: 0 !important; height: 32px !important; margin: 0 0 0 -4px !important; }
    [data-testid="action-row"] > :is(a, button, span, slot) { margin: 0 !important; }
    [data-testid="action-row"] :is(a.button, button.button, .button):not([upvote]):not([downvote]) {
      background: transparent !important; border: 0 !important; border-radius: 2px !important; color: var(--n19-action) !important; font-weight: 700 !important;
      font-size: 12px !important; line-height: 16px !important; height: 32px !important; padding: 8px 4px !important; margin: 0 4px 0 0 !important; box-shadow: none !important; }
    [data-testid="action-row"] :is(a.button, button.button, .button):not([upvote]):not([downvote]):hover { background: var(--n19-hover) !important; }
    [data-testid="action-row"] :is(.rpl-cab--content, faceplate-number) { color: inherit !important; font-weight: 700 !important; font-size: 12px !important; }
    [data-testid="action-row"] .rpl-cab--leading-icon svg { width: 20px !important; height: 20px !important; }
    [data-testid="action-row"] > span:has(shreddit-vote-animations) { position: absolute !important; left: 0 !important; top: 0 !important; width: 40px !important; height: auto !important;
      padding: 8px 0 0 !important; box-sizing: border-box !important; background: transparent !important; border: 0 !important; z-index: 1 !important; }
    .rpl-vote-button-group { flex-direction: column !important; height: auto !important; background: transparent !important; border: 0 !important; padding: 0 !important; gap: 0 !important; width: 40px !important; }
    .rpl-vote-button-group > span { font-size: 12px !important; font-weight: 700 !important; line-height: 16px !important; color: var(--n19-text) !important; text-transform: lowercase !important; margin: 2px 0 !important; pointer-events: none; }
    .rpl-vote-button-group button { height: 24px !important; width: 24px !important; min-height: 0 !important; background: transparent !important; color: var(--n19-action) !important; border-radius: 2px !important; }
    .rpl-vote-button-group button:hover { background: var(--n19-hover) !important; }
    .rpl-vote-button-group button[upvote]:hover { color: var(--n19-up) !important; }
    .rpl-vote-button-group button[downvote]:hover { color: var(--n19-down) !important; }
    .rpl-vote-button-group button > span { margin: 0 !important; }
    button[upvote][aria-pressed="true"] { color: var(--n19-up) !important; }
    button[downvote][aria-pressed="true"] { color: var(--n19-down) !important; }
    .rpl-vote-button-group:has(button[upvote][aria-pressed="true"]) > span { color: var(--n19-up) !important; }
    .rpl-vote-button-group:has(button[downvote][aria-pressed="true"]) > span { color: var(--n19-down) !important; }
    h2.condensed-post-title-heading, h1 { margin: 0 0 8px !important; }
    .vote-icon-outline { display: none !important; }
    .vote-icon-fill { display: flex !important; }
    slot[name="post-stats-entry-point"], slot[name="post-insights-panel"] { display: none !important; }
    award-button [data-n19-count], award-button .award-count { display: none !important; }
  `;
  const CLASSIC = `
    :host { display: block !important; }
    .grid { grid-template-columns: auto 1fr !important; }
    div:has(> slot[name="thumbnail"]) { align-self: start !important; }
    div:has(> div > slot[name="credit-bar"]) { display: flex !important; flex-direction: column !important; margin: 0 !important; }
    div:has(> slot[name="credit-bar"]) { order: 2 !important; margin: 2px 0 0 !important; }
    div.contents > div.overflow-hidden { order: 1 !important; }
    div.contents > :not(div.overflow-hidden) { order: 3 !important; }
    h2.condensed-post-title-heading { display: inline !important; margin: 0 4px 0 0 !important; font-size: 16px !important; line-height: 20px !important; }
    div.contents > div.overflow-hidden { line-height: 20px !important; }
    div:has(> slot[name="thumbnail"]) { margin: 0 8px 8px 0 !important; }
    rpl-action-bar > div { margin: 2px 0 0 -4px !important; gap: 0 !important; height: 32px !important; overflow: visible !important; }
    rpl-action-bar span.relative:has(> shreddit-vote-animations) { position: absolute !important; left: 0 !important; top: 0 !important; width: 40px !important; height: 100% !important;
      padding: 4px 0 0 !important; box-sizing: border-box !important; display: flex !important; justify-content: center !important; }
    button.toggle__expando-button { background: transparent !important; border: 0 !important; border-radius: 2px !important; color: var(--n19-action) !important; height: 32px !important;
      width: 32px !important; padding: 0 !important; margin: 0 4px 0 0 !important; box-shadow: none !important; }
    button.toggle__expando-button:hover { background: var(--n19-hover) !important; }
    div:has(> slot[name="expando-content"]) { margin: 0 0 8px !important; }
  `;
  const ACTIONS = `
    #unpacked-actions { gap: 0 !important; }
    #unpacked-actions :is(a, button).button { background: transparent !important; border: 0 !important; border-radius: 2px !important; box-shadow: none !important; color: var(--n19-action) !important;
      font: 700 12px/16px var(--n19-font) !important; height: 32px !important; padding: 8px 4px !important; margin: 0 4px 0 0 !important; }
    #unpacked-actions :is(a, button).button:hover { background: var(--n19-hover) !important; }
    #unpacked-actions .rpl-cab--content { text-transform: capitalize !important; color: inherit !important; font: inherit !important; }
    #unpacked-actions .rpl-cab--leading-icon::before { content: ""; flex: 0 0 20px; width: 20px; height: 20px; margin: 0 6px 0 0; background: currentColor; -webkit-mask: no-repeat center / 20px 20px; mask: no-repeat center / 20px 20px; }
    #unpacked-actions [data-item-id="comments"] .rpl-cab--leading-icon::before { -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M10%202.5c-4.4%200-8%202.9-8%206.6%200%202%201.1%203.8%202.8%205L4%2017.5l4-2.1c.6.1%201.3.2%202%20.2%204.4%200%208-2.9%208-6.5S14.4%202.5%2010%202.5zm0%2011.3c-.7%200-1.3-.1-1.9-.2l-.4-.1-1.6.8.3-1.4-.5-.3C4.5%2011.7%203.8%2010.4%203.8%209.1%203.8%206.4%206.6%204.3%2010%204.3s6.2%202.1%206.2%204.8-2.8%204.7-6.2%204.7z'/%3E%3C/svg%3E"); mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M10%202.5c-4.4%200-8%202.9-8%206.6%200%202%201.1%203.8%202.8%205L4%2017.5l4-2.1c.6.1%201.3.2%202%20.2%204.4%200%208-2.9%208-6.5S14.4%202.5%2010%202.5zm0%2011.3c-.7%200-1.3-.1-1.9-.2l-.4-.1-1.6.8.3-1.4-.5-.3C4.5%2011.7%203.8%2010.4%203.8%209.1%203.8%206.4%206.6%204.3%2010%204.3s6.2%202.1%206.2%204.8-2.8%204.7-6.2%204.7z'/%3E%3C/svg%3E"); }
    #unpacked-actions [data-item-id="share"] .rpl-cab--leading-icon::before { -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M11.5%203.5v3.1C6.4%207.2%203.5%2010.6%203%2016c1.7-2.6%204.3-3.9%208.5-3.9v3.2L17.5%209.4z'/%3E%3C/svg%3E"); mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M11.5%203.5v3.1C6.4%207.2%203.5%2010.6%203%2016c1.7-2.6%204.3-3.9%208.5-3.9v3.2L17.5%209.4z'/%3E%3C/svg%3E"); }
    #unpacked-actions [data-item-id="award"] .rpl-cab--leading-icon::before { -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M16%207h-2.3c.4-.4.6-1%20.6-1.6C14.3%204%2013.2%203%2011.8%203c-.8%200-1.4.4-1.8%201-.4-.6-1-1-1.8-1C6.8%203%205.7%204%205.7%205.4c0%20.6.2%201.2.6%201.6H4c-.6%200-1%20.4-1%201v2c0%20.6.4%201%201%201v6c0%20.6.4%201%201%201h10c.6%200%201-.4%201-1v-6c.6%200%201-.4%201-1V8c0-.6-.4-1-1-1zm-4.2-2.3c.5%200%20.8.3.8.7s-.3.7-.8.7h-1.1v-.3c0-.6.5-1.1%201.1-1.1zM7.4%205.4c0-.4.3-.7.8-.7.6%200%201.1.5%201.1%201.1v.3H8.2c-.5%200-.8-.3-.8-.7zM9.2%2016H5.8v-6h3.4zm0-7.3H4.8V8.3h4.4zm5%207.3h-3.4v-6h3.4zm1-7.3h-4.4V8.3h4.4z'/%3E%3C/svg%3E"); mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M16%207h-2.3c.4-.4.6-1%20.6-1.6C14.3%204%2013.2%203%2011.8%203c-.8%200-1.4.4-1.8%201-.4-.6-1-1-1.8-1C6.8%203%205.7%204%205.7%205.4c0%20.6.2%201.2.6%201.6H4c-.6%200-1%20.4-1%201v2c0%20.6.4%201%201%201v6c0%20.6.4%201%201%201h10c.6%200%201-.4%201-1v-6c.6%200%201-.4%201-1V8c0-.6-.4-1-1-1zm-4.2-2.3c.5%200%20.8.3.8.7s-.3.7-.8.7h-1.1v-.3c0-.6.5-1.1%201.1-1.1zM7.4%205.4c0-.4.3-.7.8-.7.6%200%201.1.5%201.1%201.1v.3H8.2c-.5%200-.8-.3-.8-.7zM9.2%2016H5.8v-6h3.4zm0-7.3H4.8V8.3h4.4zm5%207.3h-3.4v-6h3.4zm1-7.3h-4.4V8.3h4.4z'/%3E%3C/svg%3E"); }
    #unpacked-actions [data-item-id="report"] .rpl-cab--leading-icon::before { -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M4%202.5h1.8v15H4zm2.6.8c3.6-1.5%205.2%201.5%209.4%200v8.2c-4.2%201.5-5.8-1.5-9.4%200z'/%3E%3C/svg%3E"); mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M4%202.5h1.8v15H4zm2.6.8c3.6-1.5%205.2%201.5%209.4%200v8.2c-4.2%201.5-5.8-1.5-9.4%200z'/%3E%3C/svg%3E"); }
    #unpacked-actions [data-item-id="save"] .rpl-cab--leading-icon::before { -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M5%202.5h10c.6%200%201%20.4%201%201v14l-6-3.5-6%203.5v-14c0-.6.4-1%201-1zm.8%201.8v10.1l4.2-2.4%204.2%202.4V4.3z'/%3E%3C/svg%3E"); mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M5%202.5h10c.6%200%201%20.4%201%201v14l-6-3.5-6%203.5v-14c0-.6.4-1%201-1zm.8%201.8v10.1l4.2-2.4%204.2%202.4V4.3z'/%3E%3C/svg%3E"); }
    #unpacked-actions [data-item-id="hide"] .rpl-cab--leading-icon::before { -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M10%202a8%208%200%201%200%200%2016%208%208%200%200%200%200-16zm0%201.8c1.4%200%202.7.5%203.8%201.3l-8.7%208.7A6.2%206.2%200%200%201%2010%203.8zm0%2012.4c-1.4%200-2.7-.5-3.8-1.3l8.7-8.7A6.2%206.2%200%200%201%2010%2016.2z'/%3E%3C/svg%3E"); mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M10%202a8%208%200%201%200%200%2016%208%208%200%200%200%200-16zm0%201.8c1.4%200%202.7.5%203.8%201.3l-8.7%208.7A6.2%206.2%200%200%201%2010%203.8zm0%2012.4c-1.4%200-2.7-.5-3.8-1.3l8.7-8.7A6.2%206.2%200%200%201%2010%2016.2z'/%3E%3C/svg%3E"); }
    button[aria-label*="more" i], button[aria-label*="overflow" i] { color: var(--n19-action) !important; background: transparent !important; }
  `;
  const PDP = `[data-testid="action-row"] > span:has(shreddit-vote-animations) { top: 8px !important; }`;
  const TREE_VOTES = `
    shreddit-vote-animations { position: absolute !important; left: 4px !important; top: -32px !important; z-index: 1 !important; }
    .rpl-vote-button-group { flex-direction: column !important; height: auto !important; width: 24px !important; gap: 0 !important; padding: 0 !important; }
    .rpl-vote-button-group > span { display: none !important; }
    .rpl-vote-button-group button { width: 24px !important; height: 24px !important; min-height: 0 !important; }
    .rpl-vote-button-group button > span { margin: 0 !important; }
  `;
  const COMMENT = `
    .vote-icon-outline { display: none !important; }
    .vote-icon-fill { display: flex !important; }
    .rpl-vote-button-group { background: transparent !important; border: 0 !important; }
    .rpl-vote-button-group > span { font-size: 12px !important; font-weight: 700 !important; color: var(--n19-text) !important; text-transform: lowercase !important; }
    .rpl-vote-button-group button { background: transparent !important; color: var(--n19-action) !important; border-radius: 2px !important; }
    .rpl-vote-button-group button:hover { background: var(--n19-hover) !important; }
    button[upvote][aria-pressed="true"] { color: var(--n19-up) !important; }
    button[downvote][aria-pressed="true"] { color: var(--n19-down) !important; }
    slot[name="comment-insight"], slot[name="comment-share-as-post-topline"] { display: none !important; }
  `;
  const AWARD = `.glow, .rpl-cab--content { display: none !important; } button { background: transparent !important; border: 0 !important; padding: 4px !important; }`;
  const JOIN = `:host([data-testid="credit-bar-join-button"]) button { min-width: 0 !important; height: 24px !important; padding: 0 12px !important; }
    button { border-radius: 4px !important; text-transform: uppercase !important; font-size: 12px !important; font-weight: 700 !important; letter-spacing: .5px !important; min-width: 96px !important; }`;
  const COMMUNITY = `
    .header { padding: 12px 12px 0 !important; }
    #title { color: var(--n19-text) !important; font: 500 16px/20px var(--n19-font) !important; margin: 0 0 8px !important; }
    #description { color: var(--n19-text) !important; font: 400 14px/21px var(--n19-body-font) !important; }
    strong { color: var(--n19-text) !important; font: 500 16px/20px var(--n19-font) !important; }
    [data-testid="activity-indicators"] { padding: 8px 0 0 !important; border-top: 1px solid var(--n19-line) !important; margin-top: 12px !important; }
    [data-testid="activity-indicators"] .text-\\[12px\\] { color: var(--n19-text) !important; font: 500 12px/16px var(--n19-font) !important; }
  `;
  const FOLLOW = `button { background: var(--n19-blue) !important; color: var(--n19-on-blue) !important; border: 0 !important; border-radius: 4px !important; min-width: 120px !important;
    font: 700 12px/16px var(--n19-font) !important; letter-spacing: .5px !important; text-transform: uppercase !important; justify-content: center !important; }
    button * { color: inherit !important; }`;
  const FIELD = `.label-container, [part="container"] { border-radius: 4px !important; }`;
  const SEARCH = `
    .reddit-search-bar { background: var(--n19-field) !important; border: 1px solid var(--n19-field-border) !important; border-radius: 4px !important; box-shadow: none !important; }
    .reddit-search-bar:hover, .reddit-search-bar:focus-within { background: var(--n19-card) !important; border-color: var(--n19-blue) !important; }
    faceplate-search-input { height: 34px !important; }
    .leadingIcon > slot > svg, .leadingIcon > slot::slotted(svg) { visibility: hidden !important; }
    [slot="trailingContent"]:has(a[href*="/answers"]), a[href*="/answers"] { display: none !important; }
    .leadingIcon { flex: 0 0 20px !important; width: 20px !important; height: 20px !important; min-width: 20px !important; overflow: visible !important; background: no-repeat center / 18px 18px url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Ccircle cx='8.5' cy='8.5' r='5.8' fill='none' stroke='%23878a8c' stroke-width='1.8'/%3E%3Cpath d='M12.8 12.8l4.4 4.4' stroke='%23878a8c' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E") !important; }
    .centered-placeholder { display: none !important; }
    faceplate-search-input > [slot="leadingIcon"] { visibility: hidden !important; width: 18px !important; }
    faceplate-search-input > [slot="footer"] { display: none !important; }
    form.rounded-5, .rounded-5 { border-radius: 4px !important; }
    input, textarea { text-align: left !important; color: var(--n19-text) !important; font-family: var(--n19-font) !important; font-size: 14px !important; }
    input::placeholder, textarea::placeholder { color: var(--n19-action) !important; text-align: left !important; }
    .expanded-composer-ask-pill, .expanded-composer-ask-pill--ai, [class*="ask-tab"], #reddit-trending-searches-partial-container, #reddit-suggested-search-queries-container,
    .search-answers-carousel, [class*="answers-carousel"] { display: none !important; }
    rpl-tooltip:has(.expanded-composer-ask-pill) { display: none !important; }
      :is(button, a, [role="button"]):is([aria-label="Ask" i], [aria-label*="Reddit Answers" i], [aria-label*="Ask Reddit Answers" i], [data-testid*="answers" i], [data-testid*="ask-button" i], [class*="ask-button"], [class*="answers-button"]),
    [slot*="answers" i], [class*="ask-pill"], reddit-answers-entry-point, answers-entry-point { display: none !important; }
  `;

  const SORT = `
    button { color: var(--n19-link) !important; font: 700 12px/16px var(--n19-font) !important; letter-spacing: .5px !important; text-transform: uppercase !important;
      background: transparent !important; border-radius: 4px !important; padding: 0 6px !important; height: 32px !important; }
    button:hover { background: var(--n19-hover) !important; }
    button svg { color: var(--n19-link) !important; }
    [role="menu"], faceplate-menu, .menu, ul[role="menu"] { background: var(--n19-card) !important; border: 1px solid var(--n19-field-border) !important; border-radius: 4px !important;
      box-shadow: 0 2px 4px rgba(0,0,0,.1) !important; padding: 0 !important; }
    [role="menuitem"], li[role="presentation"] > * { font: 500 14px/18px var(--n19-font) !important; color: var(--n19-text) !important; border-radius: 0 !important; }
    [role="menuitem"]:hover { background: var(--n19-card-2) !important; }
    [role="menuitem"] :is(span, div) { color: inherit !important; }
    [role="menuitem"][aria-checked="true"], [role="menuitem"][aria-selected="true"], [role="menuitemradio"][aria-checked="true"] { color: var(--n19-link) !important; }
  `;
  const AUTH = `
    [role="dialog"] { border-radius: 4px !important; padding-left: 128px !important; box-sizing: border-box !important;
      background: var(--n19-card) url("https://www.redditstatic.com/accountmanager/bbb584033aa89e39bad69436c504c9bd.png") no-repeat left top / 128px 100% !important; }
  `;
  const svgIcon = (paths, size = 20) => {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 20 20'); svg.setAttribute('width', size); svg.setAttribute('height', size); svg.setAttribute('fill', 'currentColor'); svg.setAttribute('aria-hidden', 'true');
    for (const d of paths) { const path = document.createElementNS(ns, 'path'); path.setAttribute('d', d); svg.append(path); }
    return svg;
  };
  const ICONS = {
    home: ['M10 2.5 2 9.2l1 1.2 1-.8V17h4.5v-5h3v5H16V9.6l1 .8 1-1.2z'],
    popular: ['M12.5 5h5v5l-1.9-1.9-4.6 4.6-3-3L3.7 14l-1.2-1.2L8 7.3l3 3 3.4-3.4z'],
    all: ['M3 11h3v6H3zM8.5 3h3v14h-3zM14 7h3v10h-3z'],
    caret: ['M5.5 8h9L10 12.7z'],
    close: ['M5.2 4 10 8.8 14.8 4 16 5.2 11.2 10l4.8 4.8-1.2 1.2-4.8-4.8L5.2 16 4 14.8 8.8 10 4 5.2z'],
    community: ['M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 1.8a6.2 6.2 0 1 1 0 12.4 6.2 6.2 0 0 1 0-12.4zM10 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
    user: ['M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm0 1.5c-3.3 0-6 1.8-6 4v1.5h12v-1.5c0-2.2-2.7-4-6-4z'],
  };
  const FEEDS = [['home', 'Home', '/'], ['popular', 'Popular', '/r/popular/'], ['all', 'All', '/r/all/']];
  const make = (tag, attrs = {}, ...kids) => { const el = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v); el.append(...kids); return el; };
  const currentFeed = () => {
    const path = location.pathname;
    if (path === '/' || path === '') return ['popular', 'Popular'];
    if (/^\/r\/popular\/?/i.test(path)) return ['popular', 'Popular'];
    if (/^\/r\/all\/?/i.test(path)) return ['all', 'All'];
    const sub = path.match(/^\/r\/([^/]+)/);
    if (sub) return ['community', `r/${sub[1]}`];
    const user = path.match(/^\/(?:u|user)\/([^/]+)/);
    if (user) return ['user', `u/${user[1]}`];
    if (/^\/search/.test(path)) return ['popular', 'Search results'];
    return ['popular', 'Popular'];
  };
  const communityIcon = () => document.querySelector('.masthead img[src*="communityIcon"], .masthead img.shreddit-subreddit-icon__icon, #pdp-credit-bar img.shreddit-subreddit-icon__icon');
  const header = () => {
    const nav = document.querySelector('reddit-header-large nav.h-header-large');
    if (!nav) return;
    const left = nav.querySelector(':scope > div.pe-lg');
    const [kind, label] = currentFeed();
    let feeds = nav.querySelector('[data-n19-feeds]');
    if (left && !feeds) {
      const menu = make('div', { 'data-n19-menu': '', role: 'menu' }, make('div', { 'data-n19-menu-title': '' }, 'Reddit feeds'));
      for (const [icon, name, href] of FEEDS) menu.append(make('a', { href, role: 'menuitem' }, make('span', {}, svgIcon(ICONS[icon])), make('span', {}, name)));
      const button = make('button', { type: 'button', 'aria-haspopup': 'menu', 'aria-expanded': 'false' },
        make('span', { 'data-n19-feed-icon': '' }), make('span', { 'data-n19-feed-label': '' }), make('span', { 'data-n19-caret': '' }, svgIcon(ICONS.caret)));
      feeds = make('div', { 'data-n19-feeds': '' }, button, menu);
      const close = () => { feeds.removeAttribute('data-open'); button.setAttribute('aria-expanded', 'false'); };
      button.addEventListener('click', event => { event.stopPropagation(); const open = !feeds.hasAttribute('data-open'); if (open) { feeds.setAttribute('data-open', ''); button.setAttribute('aria-expanded', 'true'); } else close(); });
      document.addEventListener('click', event => { if (!feeds.contains(event.target)) close(); });
      document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
      left.append(feeds);
    }
    if (feeds) {
      const iconBox = feeds.querySelector('[data-n19-feed-icon]');
      const img = kind === 'community' ? communityIcon() : null;
      const src = img ? img.currentSrc || img.src : '';
      const want = src ? `img:${src}` : `icon:${kind}`;
      if (iconBox.dataset.n19Icon !== want) {
        iconBox.dataset.n19Icon = want;
        iconBox.replaceChildren(src ? make('img', { src, alt: '' }) : svgIcon(ICONS[kind === 'user' ? 'user' : kind]));
      }
      const labelBox = feeds.querySelector('[data-n19-feed-label]');
      if (labelBox.textContent !== label) labelBox.textContent = label;
    }
    const right = nav.querySelector(':scope > div.ps-lg');
    if (right && !right.querySelector('[data-n19-links]')) {
      const links = make('div', { 'data-n19-links': '' },
        make('a', { href: '/r/popular/', 'aria-label': 'Popular', title: 'Popular' }, svgIcon(ICONS.popular)),
        make('a', { href: '/r/all/', 'aria-label': 'All', title: 'All' }, svgIcon(ICONS.all)));
      right.prepend(links);
    }
    const drawer = nav.querySelector('#expand-user-drawer-button');
    const drawerIcon = drawer?.querySelector('svg[icon-name="overflow-horizontal"]');
    if (drawerIcon && !drawer.querySelector('[data-n19-user]')) {
      const holder = drawerIcon.parentElement;
      drawerIcon.style.display = 'none';
      holder.append(make('span', { 'data-n19-user': '', style: 'display:flex;color:var(--n19-action)' }, svgIcon(ICONS.user)), make('span', { 'data-n19-caret': '' }, svgIcon(ICONS.caret)));
    }
  };
  const sortBar = () => {
    const row = document.querySelector('shreddit-async-loader[bundlename="shreddit_sort_dropdown"] > div');
    if (!row || row.querySelector(':scope > [data-n19-bar-label]')) return;
    if (row.querySelector(':scope > shreddit-layout-event-setter')) row.prepend(make('span', { 'data-n19-bar-label': 'view' }, 'View'));
    row.prepend(make('span', { 'data-n19-bar-label': 'sort' }, 'Sort'));
  };
  const heading = () => {
    const feed = document.querySelector('main#main-content > shreddit-feed');
    if (!feed || feed.previousElementSibling?.hasAttribute('data-n19-heading')) return;
    if (!/^\/(?:r\/popular\/?)?$/i.test(location.pathname)) return;
    feed.before(make('div', { 'data-n19-heading': '' }, 'Popular posts'));
  };
  const ASSETS = 'https://www.redditstatic.com/desktop2x/img/id-cards/';
  const idCard = () => {
    const side = document.querySelector('#right-sidebar-contents');
    const front = /^\/(?:r\/popular\/?)?(?:best|hot|new|top|rising)?\/?$/i.test(location.pathname);
    const card = side?.querySelector(':scope > [data-n19-idcard]');
    if (!side || !front) { card?.remove(); side?.querySelector(':scope > [data-n19-premium]')?.remove(); return; }
    if (card) return;
    const box = make('div', { 'data-n19-idcard': '' },
      make('div', { 'data-n19-idcard-banner': '' }),
      make('div', { 'data-n19-idcard-head': '' }, make('img', { src: ASSETS + 'snoo-home@2x.png', alt: '' }), make('span', {}, 'r/popular')),
      make('p', {}, 'The best posts on Reddit for you, pulled from the most active communities on Reddit. Check here to see the most shared, upvoted, and commented content on the internet.'),
      make('a', { href: '/submit', 'data-n19-idcard-button': '' }, 'Create Post'));
    const premium = make('a', { href: '/premium/', 'data-n19-premium': '' },
      make('span', { 'data-n19-premium-text': '' }, make('b', {}, 'Reddit Premium'), make('span', {}, 'The best Reddit experience, with monthly Coins')),
      make('span', { 'data-n19-premium-button': '' }, 'Try Now'));
    side.prepend(box, premium);
  };
  const trendingTitle = () => {
    const title = document.querySelector('#right-sidebar-container aside.right-rail-popular-communities h2 .i18n-translatable-text') || document.querySelector('#right-sidebar-container aside.right-rail-popular-communities h2');
    if (title && !title.children.length && /popular communities/i.test(title.textContent)) title.textContent = 'Trending Communities';
  };
  const footer = () => {
    const last = document.querySelector('#right-sidebar-container .legal-links li:last-child');
    if (!last || last.hasAttribute('data-n19-copyright')) return;
    for (const walker = document.createTreeWalker(last, NodeFilter.SHOW_TEXT); walker.nextNode();) {
      const node = walker.currentNode;
      if (/©/.test(node.nodeValue)) { node.nodeValue = node.nodeValue.replace(/Reddit,? Inc\.?\s*©\s*\d{4}\.?/i, 'Reddit Inc © 2019.'); last.setAttribute('data-n19-copyright', ''); }
    }
  };

  const LEGAL_LATER = /^(?:Accessibility|Your Privacy Choices|Best of Reddit.*|News|Explore|简体中文|日本語|한국어|Deutsch|Español|Français|Italiano|Português.*)$/;
  const LEGAL_WORDS = new Map([['Reddit Rules', 'Content Policy']]);
  const STAT_LATER = /^(?:Contributions|Reddit Age)$/;
  const hide = el => { if (el && !el.hasAttribute('data-n19-later')) el.setAttribute('data-n19-later', ''); };
  const after2019 = () => {
    for (const a of document.querySelectorAll('#right-sidebar-container .legal-links a, .legal-links a')) {
      const text = a.textContent.replace(/\s+/g, ' ').trim();
      if (LEGAL_LATER.test(text)) hide(a.closest('li') || a);
      else if (LEGAL_WORDS.has(text)) a.textContent = LEGAL_WORDS.get(text);
    }
    for (const p of document.querySelectorAll('#right-sidebar-container p')) if (STAT_LATER.test(p.textContent.trim())) hide(p.parentElement?.tagName === 'ACTIVATE-FEATURE' ? p.parentElement.parentElement : p.parentElement);
    for (const button of document.querySelectorAll('button[aria-label="Feed options"]')) hide(button.closest('shreddit-layout-event-setter, rpl-dropdown') || button);
    for (const card of document.querySelectorAll('rpl-hovercard:has(> span.block):has(.verification-content)')) hide(card.parentElement?.children.length === 1 ? card.parentElement : card);
    for (const h of document.querySelectorAll('#right-sidebar-container h2')) if (/^(?:View Post in|Top Posts|Related Answers|Related Posts)$/i.test(h.textContent.trim())) hide(h.closest('div.border-solid, aside, section') || h.parentElement);
    for (const list of document.querySelectorAll('#right-sidebar-container ul:has(a[href*="developers.reddit.com/apps/"])')) {
      hide(list);
      const box = list.parentElement;
      for (const label of box?.querySelectorAll(':scope > :is(h2, h3, span, div, summary)') || []) if (/^Installed Apps$/i.test(label.textContent.trim())) hide(label);
      const previous = box?.previousElementSibling;
      if (previous && /^Installed Apps$/i.test(previous.textContent.trim())) hide(previous);
    }
    for (const p of document.querySelectorAll('#right-sidebar-container li p, #right-sidebar-container li span')) if (/^Unlocked by /.test(p.textContent.trim()) && !p.children.length) hide(p);
  };

  const FONT_ROOT = 'https://www.redditstatic.com/desktop2x/fonts/';
  const FONTS = [
    ['IBMPlexSans', 'IBMPlexSans/Regular-116bb6d508f5307861d3b1269bc597e7.woff2', { weight: '400' }],
    ['IBMPlexSans', 'IBMPlexSans/Medium-c4b185e25a4dde85a29f902cd5ce5360.woff2', { weight: '500' }],
    ['IBMPlexSans', 'IBMPlexSans/Bold-875de5047556e7c822519d95d7ee692d.woff2', { weight: '600 900' }],
    ['Noto Sans', 'NotoSans/Regular-d6a6aa8dc0f93416a832ea04a18c6fb8.woff2', { weight: '400' }],
    ['Noto Sans', 'NotoSans/Italic-fca7c15cdda5570c8f739b9d71e9ed6d.woff2', { weight: '400', style: 'italic' }],
    ['Noto Sans', 'NotoSans/Bold-d4ba4ecba17e90993f442f7bb082a3a2.woff2', { weight: '600 900' }],
  ];
  const loadFonts = () => {
    for (const [family, file, descriptors] of FONTS) {
      fetch(FONT_ROOT + file, { credentials: 'omit', cache: 'force-cache' })
        .then(response => response.ok ? response.arrayBuffer() : Promise.reject(response.status))
        .then(data => new FontFace(family, data, { display: 'swap', ...descriptors }).load())
        .then(face => document.fonts.add(face))
        .catch(() => {});
    }
  };
  const styled = new WeakMap();
  const add = (root, css) => {
    if (!root) return;
    const node = styled.get(root);
    if (node) { if (node.textContent !== css) node.textContent = css; return; }
    const sheet = document.createElement('style'); sheet.textContent = css; root.append(sheet); styled.set(root, sheet);
  };
  let retry = 0, retries = 0;
  const style = (host, css) => {
    if (!host) return;
    if (host.shadowRoot) { add(host.shadowRoot, css); return; }
    if (retry || retries > 120) return;
    retries++;
    retry = setTimeout(() => { retry = 0; later(); }, 500);
  };
  const deep = (root, css) => { for (const host of root.querySelectorAll('*')) if (host.shadowRoot) { add(host.shadowRoot, css); deep(host.shadowRoot, css); } };

  const UNITS = { s: 'second', sec: 'second', m: 'minute', min: 'minute', h: 'hour', hr: 'hour', d: 'day', day: 'day', w: 'week', wk: 'week', mo: 'month', y: 'year', yr: 'year' };
  const longTime = text => text.replace(/^(\d+)\s*(s|sec|m|min|h|hr|d|day|w|wk|mo|y|yr)s?\.?\s+ago$/i, (_, n, u) => `${n} ${UNITS[u.toLowerCase()]}${n === '1' ? '' : 's'} ago`);
  const times = scope => {
    for (const el of scope.querySelectorAll('faceplate-timeago time, faceplate-timeago:not(:has(time))')) {
      if (el.closest('#right-sidebar-container')) continue;
      for (const node of el.childNodes) if (node.nodeType === 3 && node.nodeValue.trim()) { const t = longTime(node.nodeValue.trim()); if (t !== node.nodeValue.trim()) node.nodeValue = t; }
    }
  };
  const pretty = n => n >= 1e5 ? Math.round(n / 1e3) + 'k' : n >= 1e4 ? (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k' : String(n);
  const mark = (el, attr, text, where) => { const s = document.createElement('span'); s.setAttribute(attr, ''); s.textContent = text; where(s); return s; };

  const domainLink = post => {
    const title = post.querySelector(':scope > [slot="title"]');
    const href = post.getAttribute('content-href') || '';
    const domain = post.getAttribute('domain') || '';
    if (!title || title.querySelector('[data-n19-domain]') || post.getAttribute('post-type') !== 'link' || !/^https?:/.test(href) || /^self\./.test(domain)) return;
    const shown = href.replace(/^https?:\/\/(?:www\.)?/, '');
    title.append(make('a', { 'data-n19-domain': '', href, target: '_blank', rel: 'noopener nofollow ugc' }, shown.length > 20 ? shown.slice(0, 20) + '...' : shown));
  };
  const scan = () => {
    for (const post of document.querySelectorAll('shreddit-post, shreddit-ad-post')) {
      const classic = post.getAttribute('view-type') === 'compactView' || post.tagName === 'SHREDDIT-AD-POST' && !!post.closest('shreddit-feed')?.querySelector('shreddit-post[view-type="compactView"]');
      if (classic && !post.hasAttribute('data-n19-classic')) post.setAttribute('data-n19-classic', '');
      style(post, POST + (post.getAttribute('view-context') === 'CommentsPage' ? PDP : '') + (classic ? CLASSIC : ''));
      if (post.getAttribute('view-type') === 'compactView') domainLink(post);
      const author = post.getAttribute('author');
      const bar = post.querySelector(':scope > [slot="credit-bar"] [id^="feed-post-credit-bar"]');
      const community = bar?.querySelector('a[data-testid="subreddit-name"]');
      if (community && /^\s*u\//.test(community.textContent) && !bar.querySelector('[data-n19-posted]') && post.tagName === 'SHREDDIT-POST') {
        mark(bar, 'data-n19-posted', 'Posted by', s => community.closest('span.flex, faceplate-hovercard')?.before(s));
      }
      if (author && bar && community && /^\s*r\//.test(community.textContent) && !bar.querySelector('[data-n19-posted]') && post.tagName === 'SHREDDIT-POST') {
        const time = bar.querySelector(':scope > faceplate-timeago');
        if (time) {
          const posted = document.createElement('span'); posted.setAttribute('data-n19-posted', '');
          posted.append('Posted by ');
          const a = document.createElement('a'); a.href = `/user/${encodeURIComponent(author)}/`; a.textContent = `u/${author}`; a.style.position = 'relative';
          posted.append(a);
          time.before(posted);
        }
      }
      const byline = bar?.querySelector('[slot="authorName"]');
      if (byline && !bar.querySelector('[data-n19-posted]')) mark(bar, 'data-n19-posted', 'Posted by', s => (byline.parentElement?.matches('span.relative') ? byline.parentElement : byline).before(s));
      const pdp = post.querySelector(':scope > #pdp-credit-bar [slot="authorName"]');
      if (pdp && !pdp.querySelector('[data-n19-posted]')) mark(pdp, 'data-n19-posted', 'Posted by u/', s => pdp.prepend(s));
      const comments = post.shadowRoot?.querySelector('[data-post-click-location="comments-button"] .rpl-cab--content, [data-action-bar-action="comments"] .rpl-cab--content');
      if (comments && !comments.querySelector('[data-n19-label]')) mark(comments, 'data-n19-label', ' Comments', s => comments.append(s));
    }
    for (const row of document.querySelectorAll('shreddit-comment-action-row')) style(row, COMMENT + (row.closest('shreddit-comment') ? TREE_VOTES : ''));
    for (const award of document.querySelectorAll('award-button')) style(award, AWARD);
    for (const menu of document.querySelectorAll('shreddit-feed :is(shreddit-post[view-type="compactView"], shreddit-ad-post) unpacking-overflow-menu')) style(menu, ACTIONS);
    for (const search of document.querySelectorAll('reddit-search-large')) {
      for (const name of ['show-ask-button', 'ask-button-variant', 'show-ask-text', 'expanded-composer-enabled', 'expanded-composer-ask-enabled']) if (search.hasAttribute(name)) search.removeAttribute(name);
      const input = search.shadowRoot?.querySelector('faceplate-search-input');
      if (input && input.getAttribute('placeholder') !== 'Search Reddit') input.setAttribute('placeholder', 'Search Reddit');
    }
    for (const join of document.querySelectorAll('shreddit-join-button')) style(join, JOIN);
    for (const holder of document.querySelectorAll('shreddit-subreddit-header-buttons')) for (const join of holder.shadowRoot?.querySelectorAll('shreddit-join-button') || []) style(join, JOIN);
    for (const card of document.querySelectorAll('shreddit-subreddit-header')) style(card, COMMUNITY);
    for (const follow of document.querySelectorAll('follow-button')) style(follow, FOLLOW);
    for (const box of document.querySelectorAll('comment-body-header faceplate-textarea-input, shreddit-composer faceplate-textarea-input')) style(box, FIELD);
    for (const comment of document.querySelectorAll('shreddit-comment[score]')) {
      const meta = comment.querySelector(':scope > details > summary [slot="commentMeta"] .author-name-meta');
      const trigger = meta?.closest('span.author-hovercard-trigger');
      if (trigger && !trigger.parentElement.querySelector(':scope > [data-n19-points]')) {
        const n = +comment.getAttribute('score');
        if (Number.isFinite(n)) mark(trigger, 'data-n19-points', `${pretty(n)} point${n === 1 ? '' : 's'}`, s => trigger.after(s));
      }
    }
    for (const search of document.querySelectorAll('reddit-search-large, faceplate-search-input, pdp-comment-search-input')) {
      style(search, SEARCH + FIELD); if (search.shadowRoot) deep(search.shadowRoot, SEARCH + FIELD);
    }
    const about = document.querySelector('#right-sidebar-contents aside.subreddit-right-rail-community-info > div > shreddit-subreddit-header');
    if (about && !about.parentElement.querySelector(':scope > [data-n19-strip]')) { const strip = document.createElement('div'); strip.setAttribute('data-n19-strip', ''); strip.textContent = 'Community Details'; about.before(strip); }
    for (const box of document.querySelectorAll('comment-body-header faceplate-textarea-input[placeholder="Join the conversation"]')) box.setAttribute('placeholder', 'What are your thoughts?');
    for (const sort of document.querySelectorAll('shreddit-sort-dropdown')) style(sort, SORT);
    for (const auth of document.querySelectorAll('auth-flow-modal')) {
      style(auth, AUTH);
      for (const field of auth.querySelectorAll('faceplate-text-input')) style(field, FIELD);
    }
    header(); sortBar(); idCard(); trendingTitle(); footer(); after2019();
    times(document);
  };
  let queued = false;
  function later() { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; scan(); }); }
  const start = () => {
    scan();
    new MutationObserver(() => { retries = 0; later(); }).observe(document.body, { childList: true, subtree: true });
    setInterval(() => times(document), 30000);
  };
  const classicByDefault = () => {
    const feed = /^\/(?:$|(?:best|hot|new|top|rising)\/?$|r\/[^/]+\/?(?:(?:best|hot|new|top|rising)\/?)?$|(?:u|user)\/[^/]+\/?(?:submitted\/?)?$)/i.test(location.pathname);
    if (!feed || /(?:^|;\s*)compact=/.test(document.cookie) || /[?&]feedViewType=/.test(location.search)) return;
    document.cookie = 'compact=true; domain=.reddit.com; path=/; max-age=31536000; secure; samesite=lax';
    document.addEventListener('DOMContentLoaded', () => {
      const card = document.querySelector('shreddit-feed shreddit-post[view-type="cardView"]');
      const signedOut = !!document.querySelector('#login-button, a[href*="/login"]');
      if (!card || !signedOut || !/(?:^|;\s*)compact=true/.test(document.cookie)) return;
      let tried = true;
      try { tried = sessionStorage.getItem('n19-classic') === '1'; sessionStorage.setItem('n19-classic', '1'); } catch {}
      if (!tried) location.reload();
    }, { once: true });
  };
  classicByDefault();
  loadFonts();
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
