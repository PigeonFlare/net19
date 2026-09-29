(() => {
  const LATER = /^(?:telegram premium|premium|my stars|stars|buy stars|telegram stars|send (?:a )?gifts?|gifts?|gift premium|my stories|stories|post story|mini apps?|apps|open app|wallet|business|telegram business|my profile gifts|boosts?|stickers? maker|create sticker|translate|show translation|translate to .{2,20}|telegram features|star reactions?|paid reaction|call|video call|voice call|start video chat|video chat|live stream|start live stream|log in (?:by|with) passkey|log in by qr code)$/i;
  globalThis.net19Theme = {
    detect: () => {
      const c = document.documentElement.classList;
      return c.contains('night') || c.contains('theme-dark') ? 'dark' : 'light';
    },
    watch: ['class'],
    later: LATER,
  };
  const text = el => (el.textContent || '').replace(/\s+/g, ' ').trim();
  const hide = () => {
    for (const item of document.querySelectorAll('.btn-menu .btn-menu-item:not([data-net19-hidden])')) {
      const label = text(item.querySelector('.btn-menu-item-text') || item);
      if (label.length < 40 && LATER.test(label)) item.setAttribute('data-net19-hidden', '');
    }
    for (const tab of document.querySelectorAll('.search-super-tabs .menu-horizontal-div-item:not([data-net19-hidden])')) {
      if (/^(?:stories|gifts|posts|saved music|similar channels|similar bots)$/i.test(text(tab))) tab.setAttribute('data-net19-hidden', '');
    }
    for (const button of document.querySelectorAll('#auth-pages button:not([data-net19-hidden]), .Auth button:not([data-net19-hidden])')) {
      if (/^log in (?:by|with) passkey$/i.test(text(button))) button.setAttribute('data-net19-hidden', '');
    }
    for (const card of document.querySelectorAll('#auth-pages [class*="_pageSignQR_"]')) {
      if (!card.querySelector(':scope > button') || card.querySelector(':scope > .n19-sign-in')) continue;
      const title = document.createElement('div');
      title.className = 'n19-sign-in';
      title.textContent = 'Sign in';
      card.prepend(title);
    }
  };
  const signInTitle = () => {
    const title = document.querySelector('.Auth .auth-form > h1:not([data-n19-label])');
    if (title && document.querySelector('.Auth .auth-form #sign-in-phone-number') && text(title) === 'Telegram') title.setAttribute('data-n19-label', 'Sign in');
  };
  let phoneTries = 0, phoneAt = 0;
  const choosePhoneLogin = () => {
    if (phoneTries >= 40 || performance.now() - phoneAt < 700) return;
    const qr = [...document.querySelectorAll('h1, h2, h4, .qr-description, [class*="title" i]')].find(h => /^log in (?:to telegram )?by qr code$/i.test(text(h)));
    if (!qr) return;
    const card = qr.closest('[class*="_pageSignQR_"], .auth-form');
    if (card) for (const part of card.children) if (!part.querySelector('button') && !part.matches('button, .n19-sign-in')) part.setAttribute('data-net19-hidden', '');
    const phone = [...document.querySelectorAll('button, .btn-primary, [role="button"]')].find(b => /^log in by phone number$/i.test(text(b)));
    if (!phone) return;
    phoneTries++;
    phoneAt = performance.now();
    for (const type of ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click']) phone.dispatchEvent(new (type.startsWith('pointer') ? PointerEvent : MouseEvent)(type, { bubbles: true, cancelable: true, button: 0, view: window }));
    setTimeout(later, 750);
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; hide(); choosePhoneLogin(); signInTitle(); }); };
  const start = () => { hide(); choosePhoneLogin(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  net19.onBody(start);
})();
