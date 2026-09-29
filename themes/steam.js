globalThis.net19Theme = {
  only: 'dark',
  detect: () => 'dark',
  searchLabel: 'search the store',
  later: /^(?:award|points shop|steam points|my family|steam families|family management|steam deck|steam deck verified|great on deck|steam deck compatibility|steam frame|steam machine|steam controller \(2026\)|steam replay|game recording|open in desktop app|send a gift card|digital gift cards?|trending free|what curators say)$/i,
  intended: '#sale_under10_area, #tab_trendingfree_content_trigger, [data-n19-later]',
};
(() => {
  const TAB_NAMES = { tab_newreleases_content_trigger: 'New and Trending', tab_topsellers_content_trigger: 'Top Selling' };
  const LATER_SECTIONS = /^(?:Browse by Category|What Curators Say)$/;
  const LATER_FOOTER = /^(?:Get Steam|Get Mobile Apps|Get Support|My Account|Hardware)$/;
  const fix = () => {
    for (const [id, name] of Object.entries(TAB_NAMES)) {
      const tab = document.getElementById(id);
      const text = tab && [...tab.querySelectorAll('*')].find(n => n.children.length === 0 && n.textContent.trim() && n.textContent.trim() !== name && /[A-Za-z]/.test(n.textContent));
      if (text) text.textContent = name;
    }
    for (const heading of document.querySelectorAll('.home_section_title, [role="heading"], h2')) {
      if (!LATER_SECTIONS.test(heading.textContent.trim())) continue;
      const block = heading.closest('.content_hub_carousel_ctn, .home_pagecontent_ctn, .block, section') || heading.parentElement;
      if (block && !block.hasAttribute('data-n19-later')) block.setAttribute('data-n19-later', '');
    }
    for (const a of document.querySelectorAll('[data-featuretarget="footer"] a')) {
      const href = a.getAttribute('href') || '';
      if (LATER_FOOTER.test(a.textContent.trim()) || /youtube\.com|bsky\.app/.test(href)) a.setAttribute('data-n19-later', '');
    }
    if (globalThis.net19Lang?.() === 'en') for (const input of document.querySelectorAll('input[name="term"]')) if (input.placeholder && input.placeholder !== 'search the store') input.placeholder = 'search the store';
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; setTimeout(() => { queued = false; fix(); }, 300); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  net19.onBody(start);
})();
globalThis.net19Theme.words = {"Tienda de puntos": "Points Shop", "Enviar una tarjeta regalo": "Send a Gift Card", "Gratuitos populares": "Trending Free", "Perfectos para Deck": "Great on Deck", "Aplicaciones móviles": "Get Mobile Apps", "Boutique des points": "Points Shop", "Envoyer une carte-cadeau": "Send a Gift Card", "Gratuits tendance": "Trending Free", "Parfaits pour Steam Deck": "Great on Deck", "Matériel": "Hardware", "Télécharger les applications mobiles": "Get Mobile Apps", "Loja de pontos": "Points Shop", "Enviar um vale-presente": "Send a Gift Card", "Ótimos no Deck": "Great on Deck", "Negozio dei punti": "Points Shop", "Invia un buono regalo": "Send a Gift Card", "Gratuiti di tendenza": "Trending Free", "Perfetti per il Deck": "Great on Deck", "ポイントショップ": "Points Shop", "ギフトカードを送信": "Send a Gift Card", "話題の無料作品": "Trending Free", "Deckで快適に動作": "Great on Deck", "点数商店": "Points Shop", "发送礼物卡": "Send a Gift Card", "人气蹿升的免费游戏": "Trending Free", "非常适合 Deck": "Great on Deck", "포인트 상점": "Points Shop", "기프트 카드 보내기": "Send a Gift Card", "주목받는 무료 게임": "Trending Free", "Deck 완벽 호환": "Great on Deck", "Предметы за очки": "Points Shop", "Отправить подарочную карту": "Send a Gift Card", "Популярные бесплатные игры": "Trending Free", "Отлично на Deck": "Great on Deck", "متجر النقاط": "Points Shop", "إرسال بطاقة هدايا": "Send a Gift Card", "المجانية الرائجة": "Trending Free", "تعمل جيدًا على Deck": "Great on Deck", "Baixe os aplicativos móveis": "Get Mobile Apps", "Scarica le app mobili": "Get Mobile Apps", "ハードウェア": "Hardware", "モバイルアプリをダウンロード": "Get Mobile Apps", "硬件": "Hardware", "下载手机应用": "Get Mobile Apps", "하드웨어": "Hardware", "모바일 앱 다운로드": "Get Mobile Apps", "Оборудование": "Hardware", "Установить мобильные приложения": "Get Mobile Apps", "جهاز": "Hardware", "احصل على تطبيقات المحمول": "Get Mobile Apps"};
