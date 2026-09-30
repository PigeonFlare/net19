globalThis.net19Theme = {
  detect: () => document.documentElement.classList.contains('tw-root--theme-dark') ? 'dark' : 'light',
  watch: ['class'],
  later: /^(?:stories|create a story|view stories|discovery feed|try the discovery feed|clips feed|watch clips feed|shorts|guest star|request to join|hype chat|send a hype chat|top clip|last stream|replay ad|leave feedback for this ad|try 1-month ad-free|go ad-free(?: for free)?|ad-free for free)$/i,
};
(() => {
  const copyOf = (item, label, href) => {
    const copy = item.cloneNode(true);
    const a = copy.querySelector('a');
    if (!a) return null;
    a.href = href; a.setAttribute('aria-label', label); a.setAttribute('data-net19-link', ''); a.removeAttribute('data-a-target'); a.removeAttribute('data-test-selector');
    a.removeAttribute('aria-current'); a.classList.remove('active');
    for (const p of a.querySelectorAll('p')) p.textContent = label;
    for (const d of a.querySelectorAll('[aria-label]')) d.setAttribute('aria-label', label);
    copy.setAttribute('data-net19-link', '');
    return copy;
  };
  const links = () => {
    const browse = document.querySelector('nav.top-nav a[data-a-target="browse-link"]');
    const item = browse?.parentElement;
    if (!item) return;
    const added = item.parentElement.querySelector('a[data-net19-prime]');
    if (added) {
      const crown = !added.querySelector('[data-net19-prime-icon]') && document.querySelector('nav.top-nav [data-a-target="prime-offers-icon"] svg');
      if (crown) { const icon = document.createElement('span'); icon.setAttribute('data-net19-prime-icon', ''); icon.append(crown.cloneNode(true)); added.prepend(icon); }
      return;
    }
    if (item.parentElement.querySelector('[data-net19-link]')) return;
    const discover = copyOf(item, 'Discover', '/');
    const prime = copyOf(item, 'Try Prime', 'https://gaming.amazon.com/');
    if (!discover || !prime) return;
    const pa = prime.querySelector('a'), crown = document.querySelector('nav.top-nav [data-a-target="prime-offers-icon"] svg');
    pa.setAttribute('data-net19-prime', '');
    if (crown) { const icon = document.createElement('span'); icon.setAttribute('data-net19-prime-icon', ''); icon.append(crown.cloneNode(true)); pa.prepend(icon); }
    item.before(discover); item.after(prime);
  };
  const join = () => {
    const main = document.querySelector('#front-page-main-content');
    const box = main?.querySelector(':scope > [data-net19-join]');
    const signup = document.querySelector('nav.top-nav [data-a-target="signup-button"]');
    if (!main || !signup || !(globalThis.net19Lang?.() === 'en')) { box?.remove(); return; }
    const bar = [...document.querySelectorAll('.tw-callout-message')].find(c => /Join the Twitch community/i.test(c.textContent || ''));
    if (box) {
      const img = !box.querySelector('img') && bar?.querySelector('img');
      if (img?.src) { const i = document.createElement('img'); i.src = img.src; i.alt = ''; box.prepend(i); }
      return;
    }
    const div = document.createElement('div');
    div.setAttribute('data-net19-join', '');
    const img = bar?.querySelector('img');
    if (img?.src) { const i = document.createElement('img'); i.src = img.src; i.alt = ''; div.append(i); }
    const text = document.createElement('div'), title = document.createElement('strong'), sub = document.createElement('span');
    title.textContent = 'Join the Twitch community!';
    sub.textContent = 'Discover the best live streams anywhere.';
    text.append(title, sub);
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = 'Sign Up';
    button.addEventListener('click', () => document.querySelector('nav.top-nav [data-a-target="signup-button"]')?.click());
    div.append(text, button);
    main.prepend(div);
  };
  const fix = () => {
    for (const heading of document.querySelectorAll('nav[aria-label="Left Navigation"] h3:not([data-net19-hidden])')) if (/^For You$/.test(heading.textContent.trim())) heading.setAttribute('data-net19-hidden', '');
    for (const callout of document.querySelectorAll('.tw-callout-message')) {
      const bar = callout.closest('article');
      if (bar && !bar.hasAttribute('data-net19-hidden') && /Join the Twitch community/i.test(callout.textContent || '')) bar.setAttribute('data-net19-hidden', '');
    }
    for (const h of document.querySelectorAll('.side-nav-header h2, .side-nav-header h3')) {
      if (!h.children.length && h.textContent.trim() === 'Live Channels') h.textContent = 'Recommended Channels';
    }
    for (const card of document.querySelectorAll('.side-nav-card')) {
      for (const p of card.querySelectorAll('p, span')) {
        if (!p.hasAttribute('data-net19-hidden') && /^(?:Shared |Community )?(?:Hype|Mythic|Community|Golden Kappa|Treasure) Train\b/.test(p.textContent.trim())) {
          const row = p.parentElement;
          (row && !row.querySelector('[data-a-target="side-nav-title"], [data-a-target="side-nav-card-metadata"], img') ? row : p).setAttribute('data-net19-hidden', '');
        }
      }
    }
    for (const p of document.querySelectorAll('p, h2, h3, strong, span')) {
      if (p.children.length || !/^May Contain Labeled Content$/i.test(p.textContent.trim())) continue;
      let box = p.parentElement;
      while (box && box !== document.body && !box.querySelector('button')) box = box.parentElement;
      if (!box || box === document.body || box.textContent.length >= 400) continue;
      while (box.parentElement && box.parentElement.children.length === 1 && box.parentElement.textContent.length < 400 && !/^(SECTION|MAIN|BODY)$/.test(box.parentElement.tagName)) box = box.parentElement;
      if (!box.hasAttribute('data-net19-hidden')) box.setAttribute('data-net19-hidden', '');
    }
    for (const tab of document.querySelectorAll('main [role="tablist"] a[role="tab"]')) {
      if (/^\s*Home\s*$/.test(tab.textContent || '') && !tab.hasAttribute('data-net19-hidden')) tab.setAttribute('data-net19-hidden', '');
    }
    for (const a of document.querySelectorAll('#front-page-main-content h2 > a[href="/directory/all"]')) {
      if (!a.children.length && a.textContent.trim() === 'Live on Twitch') a.textContent = 'Recommended live channels';
    }
    links();
    join();
  };
  net19.watch(fix);
})();
globalThis.net19Theme.words = {"Anuncio": "Ad", "Deja comentarios sobre este anuncio": "Leave feedback for this Ad", "Publicité": "Ad", "Laisser un commentaire sur cette annonce": "Leave feedback for this Ad", "Anúncio": "Ad", "Deixar feedback sobre este anúncio": "Leave feedback for this Ad", "Annuncio": "Ad", "Lascia un feedback per questo annuncio": "Leave feedback for this Ad", "広告": "Ad", "この広告のフィードバックを残す": "Leave feedback for this Ad", "Twitchコミュニティに参加しよう！": "Join the Twitch community!", "世界最高のライブ配信を楽しもう。": "Discover the best live streams anywhere.", "登録": "Sign Up", "广告": "Ad", "对此广告留下反馈": "Leave feedback for this Ad", "加入 Twitch 社区！": "Join the Twitch community!", "探索全球最精彩的直播内容。": "Discover the best live streams anywhere.", "注册": "Sign Up", "광고": "Ad", "이 광고에 대한 피드백을 남겨주세요": "Leave feedback for this Ad", "Twitch 커뮤니티와 함께하세요!": "Join the Twitch community!", "어디서나 최고의 생방송을 즐겨보세요.": "Discover the best live streams anywhere.", "회원가입": "Sign Up", "Реклама": "Ad", "Оставить отзыв для этой рекламы": "Leave feedback for this Ad", "إعلان": "Ad", "اترك تعليقًا على هذا الإعلان": "Leave feedback for this Ad", "الانضمام إلى مجتمع Twitch!": "Join the Twitch community!", "استكشف أفضل عمليات البث المباشر في أي مكان.": "Discover the best live streams anywhere.", "تسجيل": "Sign Up"};
