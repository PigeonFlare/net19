globalThis.net19Theme = {
  detect: () => document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
  watch: ['data-theme', 'data-tux-color-scheme'],
  light: { '#ff3b5c': '#fe2c55', '#ff5370': '#ff4368', '#ff4b69': '#ff3c61', '#ff4363': '#fe345b' },
  dark: { '#ff3b5c': '#fe2c55', '#ff5370': '#ff4368', '#ff4b69': '#ff3c61', '#ff4363': '#fe345b', '#000': '#121212' },
  later: /^(?:shop|tiktok shop|sell on tiktok shop|live|go live|live tools|live studio|explore|friends|activity|short dramas|get coins|get app|pc app|download app|open app|tiktok studio|create tiktok effects|effects|rewards|coins|ai-generated|creator labeled as ai-generated|ai self|symphony|tiktok symphony|photo|photos)$/i,
  keepLabels: /^(?:for you|profile|more|log in|search)$/i,
};
(() => {
  const ITEM = '[data-e2e="recommend-list-item-container"]';
  const make = (tag, name) => { const el = document.createElement(tag); el.setAttribute('data-n19-tt', name); return el; };
  const fix = () => {
    for (const item of document.querySelectorAll(ITEM)) {
      const content = item.querySelector('[class*="--DivOverlayBottomContent"]');
      const creator = item.querySelector('[class*="--DivCreatorInfoContainer"]');
      const authorLink = item.querySelector('a[data-e2e="video-author-avatar"]');
      const href = (creator?.querySelector('a[href*="/@"]') || authorLink)?.getAttribute('href') || '';
      const id = decodeURIComponent((href.match(/\/@([^/?#]+)/) || [])[1] || '');
      if (!content || !creator || !id) continue;
      let avatar = content.querySelector(':scope > [data-n19-tt="avatar"]');
      if (!avatar) { avatar = make('a', 'avatar'); avatar.append(document.createElement('img')); content.prepend(avatar); }
      const src = authorLink?.querySelector('img')?.getAttribute('src') || '';
      const img = avatar.firstElementChild;
      if (avatar.getAttribute('href') !== href) avatar.setAttribute('href', href);
      avatar.setAttribute('aria-label', id);
      if (src && img.getAttribute('src') !== src) img.setAttribute('src', src);
      img.alt = '';
      let uid = creator.querySelector(':scope > [data-n19-tt="uid"]');
      if (!uid) { uid = make('a', 'uid'); creator.prepend(uid); }
      if (uid.getAttribute('href') !== href) uid.setAttribute('href', href);
      if (uid.textContent !== id) uid.textContent = id;
      const real = item.querySelector('[data-e2e="feed-follow"]');
      let follow = content.querySelector(':scope > [data-n19-tt="follow"]');
      if (!follow) {
        follow = make('button', 'follow'); follow.type = 'button'; follow.textContent = globalThis.net19Say?.('Follow') ?? 'Follow';
        follow.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); event.currentTarget.closest(ITEM)?.querySelector('[data-e2e="feed-follow"]')?.click(); });
        content.append(follow);
      }
      follow.hidden = !real;
    }
  };
  const verified = () => {
    const box = document.querySelector('[data-e2e="user-page"] [class*="--DivUserIdentifierWrapper"] > [class*="--DivUserTextWrapper"]');
    const badge = box?.querySelector(':scope > svg');
    const pill = box?.querySelector(':scope > [data-n19-tt="verified"]');
    if (!badge) { pill?.remove(); return; }
    if (pill && pill.previousElementSibling === badge) return;
    pill?.remove();
    const tag = make('span', 'verified');
    tag.append(badge.cloneNode(true), 'Verified account');
    badge.after(tag);
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); verified(); }); };
  const start = () => {
    fix(); verified();
    new MutationObserver(records => { for (const r of records) if (!(r.target instanceof Element && r.target.closest('[data-n19-tt]'))) { later(); return; } })
      .observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['href', 'src'] });
  };
  net19.onBody(start);
})();
globalThis.net19Theme.words = {"Boutique": "Shop", "Explorer": "Explore", "Mini-dramas": "Short dramas"};
