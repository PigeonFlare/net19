globalThis.net19Theme = {
  detect: () => 'dark',
  only: 'dark',
  watch: [],
  later: /^(?:communities|browse communities|community posts|create new community|join community|tumblr live|live|go live|watch live|blaze|blaze this post|blaze post|blazed|blaze it|tip|tips|send a tip|tip this post|tumblrmart|badges|get badges|shop badges|post\+|subscribe with post\+|tumblr premium|get premium|try premium|go ad-free.*|ad-free browsing|remove ads|get a domain|domains|patio|saved|custom feeds|change palette|palettes?)$/i,
};
(() => {
  const RENAME = new Map([['Trending Blogs', 'Recommended Blogs'], ['Check out these blogs', 'Recommended Blogs'], ['Check these out', 'Recommended Blogs']]);
  const PROMO = /Tumblr Premium|Go Ad-Free|Ad-Free Browsing|\bPost\+|TumblrMart/;
  const count = text => {
    const m = String(text || '').trim().replace(/,/g, '').match(/^([\d.]+)\s*([KMB]?)$/i);
    if (!m) return null;
    return { n: parseFloat(m[1]) * ({ '': 1, k: 1e3, m: 1e6, b: 1e9 }[m[2].toLowerCase()]), exact: !m[2] };
  };
  const format = (n, exact) => exact ? n.toLocaleString('en-US') : n >= 1e6 ? (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M' : (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  const notes = footer => {
    if ([...footer.querySelectorAll('button, a')].some(b => /\bnotes?\s*$/i.test(b.textContent))) { footer.removeAttribute('data-n19-notes'); return; }
    let total = 0, exact = true, any = false;
    for (const b of footer.querySelectorAll('button[aria-label="Comment"], button[aria-label="Reply"], button[aria-label="Reblog"], button[aria-label="Like"]')) {
      const span = b.querySelector(':scope > span + span');
      const c = span && count(span.textContent);
      if (!c) continue;
      total += c.n; exact = exact && c.exact; any = true;
    }
    const text = any && total > 0 ? `${format(total, exact)} ${total === 1 ? 'note' : 'notes'}` : '';
    if (!text) { if (footer.hasAttribute('data-n19-notes')) footer.setAttribute('data-n19-notes', ''); if (!footer.querySelector('button[aria-label="Like"]')) footer.removeAttribute('data-n19-notes'); return; }
    if (footer.getAttribute('data-n19-notes') !== text) footer.setAttribute('data-n19-notes', text);
  };
  const fix = () => {
    for (const footer of document.querySelectorAll('footer[aria-label="Post footer"]')) notes(footer);
    for (const list of document.querySelectorAll('aside ul[aria-label]')) {
      const head = list.parentElement?.querySelector(':scope > div:first-child') || list.previousElementSibling;
      const to = head && !head.querySelector('*') && RENAME.get(head.textContent.trim());
      if (to) head.textContent = to;
    }
    for (const block of document.querySelectorAll('aside > div > div, aside > div')) {
      if (block.hasAttribute('data-net19-hidden') || block.querySelector('input, textarea, [contenteditable], ul[aria-label]')) continue;
      if (PROMO.test(block.textContent || '')) block.setAttribute('data-net19-hidden', '');
    }
    for (const head of document.querySelectorAll('aside h1, aside h2, aside h3, aside div, aside span')) {
      if (head.firstElementChild || !/^Related Communities$/i.test(head.textContent.trim())) continue;
      let card = head.parentElement;
      while (card && card.parentElement && card.parentElement.tagName !== 'ASIDE' && !card.querySelector('a, button')) card = card.parentElement;
      if (card && card.tagName !== 'ASIDE' && !/Related Tags|Recommended Blogs|Sponsored/i.test(card.textContent) && !card.querySelector('input, textarea, [contenteditable]') && !card.hasAttribute('data-net19-hidden')) card.setAttribute('data-net19-hidden', '');
    }
    for (const button of document.querySelectorAll('button, a')) {
      if (!/^Sign up$/i.test(button.textContent.trim()) || button.closest('[data-net19-hidden], nav, header')) continue;
      for (let banner = button.parentElement; banner && banner !== document.body; banner = banner.parentElement) {
        const style = getComputedStyle(banner);
        if (style.position !== 'fixed' && style.position !== 'sticky') continue;
        if (/Join over [\d,]+ (million )?people using Tumblr/i.test(banner.textContent) && banner.getBoundingClientRect().bottom >= innerHeight - 4) banner.setAttribute('data-net19-hidden', '');
        break;
      }
    }
    for (const el of document.querySelectorAll('article header span, article header div')) {
      if (!el.firstElementChild && /^\s*Blazed\s*$/i.test(el.textContent) && !el.hasAttribute('data-net19-hidden')) el.setAttribute('data-net19-hidden', '');
    }
  };
  net19.watch(fix, { childList: true, subtree: true, characterData: true });
})();
globalThis.net19Theme.words = {"Comunidades": "Communities", "Cambiar la paleta": "Change palette", "Communautés": "Communities", "Changer la palette": "Change palette", "Mudar paleta": "Change palette", "Community": "Communities", "Cambia colori": "Change palette", "コミュニティ": "Communities", "パレットを変更": "Change palette", "社区": "Communities", "更改调色板": "Change palette", "커뮤니티": "Communities", "팔레트 바꾸기": "Change palette", "Сообщества": "Communities", "Изменить палитру": "Change palette", "समुदाय": "Communities", "पैलेट बदलें": "Change palette"};
