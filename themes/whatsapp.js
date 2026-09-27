(() => {
  globalThis.net19Theme = {
    detect: () => document.body?.classList.contains('dark') ? 'dark' : 'light',
    watch: ['class'],
    later: /^(?:channels|communities|new community|create channel|find channels|meta ai|message meta ai|ask meta ai|video call|voice call|start call|new call|calls|get the app for calling|imagine|ai images?)$/i,
  };
  const MENU = /^(?:select chats|mark all as read|app lock|lock app|lists|new list|add to list|remove from list|add to favou?rites|remove from favou?rites|favou?rites|lock chat|unlock chat|chat lock|chat theme|disappearing messages|pin|unpin|keep|unkeep|edit|view replies|reply in thread|add to note|add to calendar|ask meta ai|react|poll|event|quiz|question|new sticker|create sticker|ai replies)$/i;
  const text = el => (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim();
  const fix = () => {
    for (const input of document.querySelectorAll('#side input[type="text"]')) {
      const p = input.getAttribute('placeholder') || '';
      if (/^(?:search|search or start a new chat)$/i.test(p)) input.setAttribute('placeholder', 'Search or start new chat');
    }
    for (const item of document.querySelectorAll('[role="menuitem"]:not([data-net19-hidden])')) {
      const label = text(item);
      if (label.length < 40 && MENU.test(label)) item.setAttribute('data-net19-hidden', '');
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['placeholder'] }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
