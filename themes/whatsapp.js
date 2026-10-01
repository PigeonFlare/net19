(() => {
  globalThis.net19Theme = {
    detect: () => document.body?.classList.contains('dark') ? 'dark' : 'light',
    watch: ['class'],
    later: /^(?:channels|communities|new community|create channel|find channels|meta ai|message meta ai|ask meta ai|video call|voice call|start call|new call|calls|get the app for calling|imagine|ai images?)$/i,
  };
  const MENU = /^(?:select chats|mark all as read|app lock|lock app|lists|new list|add to list|remove from list|add to favou?rites|remove from favou?rites|favou?rites|lock chat|unlock chat|chat lock|chat theme|disappearing messages|pin|unpin|keep|unkeep|edit|view replies|reply in thread|add to note|add to calendar|ask meta ai|react|poll|event|quiz|question|new sticker|create sticker|ai replies)$/i;
  const text = el => (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim();
  const LANDING_WORDS = new Map([['Scan to log in', 'To use WhatsApp on your computer:'], ['Stay logged in on this browser', 'Keep me signed in'], ['Need help?', 'Need help to get started?']]);
  const hideEl = el => { if (el && !el.hasAttribute('data-net19-hidden')) el.setAttribute('data-net19-hidden', ''); };
  const landing = () => {
    const list = document.getElementById('link-device-instructions-list');
    if (!list) return;
    const page = list.closest('.app-wrapper-web') || document.body;
    for (const mark of page.querySelectorAll('[data-icon="wa-wordmark"]:not([data-n19-label])')) mark.setAttribute('data-n19-label', 'WHATSAPP WEB');
    const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const to = LANDING_WORDS.get(node.nodeValue.trim());
      if (!to) continue;
      node.nodeValue = to;
      if (to.startsWith('To use')) node.parentElement.setAttribute('data-n19-wa', 'title');
      for (const icon of node.parentElement.querySelectorAll('svg')) hideEl(icon.closest('span') || icon);
    }
    for (const id of ['link_device_qr_phone_number_link', 'link-device-qrcode-alt-linking-tc']) hideEl(page.querySelector(`[data-testid="${id}"]`));
    for (const icon of page.querySelectorAll('[data-testid="link_device_qr_help_link"] span:has(svg)')) hideEl(icon);
    const promo = page.querySelector('[data-testid="wa-web-landing-promo-get-started"]');
    if (promo) { let card = promo; while (card.parentElement && !card.parentElement.contains(list)) card = card.parentElement; hideEl(card); }
    for (const el of page.querySelectorAll('div')) if (!el.childElementCount && /^Your personal messages are end-to-end encrypted$/.test(el.textContent.trim())) hideEl(el.parentElement);
  };
  const fix = () => {
    landing();
    for (const input of document.querySelectorAll('#side input[type="text"]')) {
      const p = input.getAttribute('placeholder') || '';
      if (/^(?:search|search or start a new chat)$/i.test(p)) input.setAttribute('placeholder', 'Search or start new chat');
    }
    for (const item of document.querySelectorAll('[role="menuitem"]:not([data-net19-hidden])')) {
      const label = text(item);
      if (label.length < 40 && MENU.test(label)) item.setAttribute('data-net19-hidden', '');
    }
  };
  net19.watch(fix, { childList: true, subtree: true, attributes: true, attributeFilter: ['placeholder'] });
})();
