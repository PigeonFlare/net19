(() => {
  if (globalThis.net19) return;
  const WORDS = {
    'Search': { es: 'Buscar', fr: 'Rechercher', pt: 'Pesquisar', it: 'Cerca', ja: '検索', zh: '搜索', ko: '검색', ru: 'Поиск', hi: 'खोजें', ar: 'بحث' },
    'Sign Up': { es: 'Registrarse', fr: 'S’inscrire', pt: 'Cadastre-se', it: 'Iscriviti', ja: '登録', zh: '注册', ko: '가입하기', ru: 'Регистрация', hi: 'साइन अप करें', ar: 'إنشاء حساب' },
    'Sign in': { es: 'Iniciar sesión', fr: 'Se connecter', pt: 'Entrar', it: 'Accedi', ja: 'ログイン', zh: '登录', ko: '로그인', ru: 'Войти', hi: 'साइन इन करें', ar: 'تسجيل الدخول' },
    'Posted by': { es: 'Publicado por', fr: 'Publié par', pt: 'Postado por', it: 'Pubblicato da', ja: '投稿者', zh: '发布者', ko: '게시자', ru: 'Опубликовал', hi: 'पोस्टकर्ता', ar: 'نشر بواسطة' },
    'Home': { es: 'Inicio', fr: 'Accueil', pt: 'Início', it: 'Home', ja: 'ホーム', zh: '首页', ko: '홈', ru: 'Главная', hi: 'होम', ar: 'الرئيسية' },
    'Popular': { es: 'Popular', fr: 'Populaire', pt: 'Popular', it: 'Popolari', ja: '人気', zh: '热门', ko: '인기', ru: 'Популярное', hi: 'लोकप्रिय', ar: 'الشائع' },
    'All': { es: 'Todo', fr: 'Tout', pt: 'Tudo', it: 'Tutto', ja: 'すべて', zh: '全部', ko: '전체', ru: 'Все', hi: 'सभी', ar: 'الكل' },
    'Sort': { es: 'Ordenar', fr: 'Trier', pt: 'Ordenar', it: 'Ordina', ja: '並べ替え', zh: '排序', ko: '정렬', ru: 'Сортировка', hi: 'क्रम', ar: 'ترتيب' },
    'View': { es: 'Vista', fr: 'Affichage', pt: 'Exibição', it: 'Vista', ja: '表示', zh: '视图', ko: '보기', ru: 'Вид', hi: 'दृश्य', ar: 'عرض' },
    'Create Post': { es: 'Crear publicación', fr: 'Créer une publication', pt: 'Criar post', it: 'Crea post', ja: '投稿を作成', zh: '创建帖子', ko: '게시물 만들기', ru: 'Создать пост', hi: 'पोस्ट बनाएं', ar: 'إنشاء منشور' },
    'Follow': { es: 'Seguir', fr: 'Suivre', pt: 'Seguir', it: 'Segui', ja: 'フォロー', zh: '关注', ko: '팔로우', ru: 'Подписаться', hi: 'फ़ॉलो करें', ar: 'متابعة' },
    'Stories': { es: 'Historias', fr: 'Stories', pt: 'Stories', it: 'Storie', ja: 'ストーリーズ', zh: '快拍', ko: '스토리', ru: 'Истории', hi: 'स्टोरीज़', ar: 'القصص' },
    'About': { es: 'Acerca de', fr: 'À propos', pt: 'Sobre', it: 'Informazioni', ja: '概要', zh: '简介', ko: '정보', ru: 'О канале', hi: 'परिचय', ar: 'حول' },
    'Best of YouTube': { es: 'Lo mejor de YouTube', fr: 'Le meilleur de YouTube', pt: 'O melhor do YouTube', it: 'Il meglio di YouTube', ja: 'YouTube のベスト', zh: 'YouTube 精选', ko: 'YouTube 베스트', ru: 'Лучшее на YouTube', hi: 'YouTube की सबसे अच्छी चीज़ें', ar: 'أفضل ما في YouTube' },
    'Music': { es: 'Música', fr: 'Musique', pt: 'Música', it: 'Musica', ja: '音楽', zh: '音乐', ko: '음악', ru: 'Музыка', hi: 'संगीत', ar: 'موسيقى' },
    'Sports': { es: 'Deportes', fr: 'Sport', pt: 'Esportes', it: 'Sport', ja: 'スポーツ', zh: '体育', ko: '스포츠', ru: 'Спорт', hi: 'खेल', ar: 'رياضة' },
    'Gaming': { es: 'Videojuegos', fr: 'Jeux vidéo', pt: 'Jogos', it: 'Videogiochi', ja: 'ゲーム', zh: '游戏', ko: '게임', ru: 'Видеоигры', hi: 'गेमिंग', ar: 'ألعاب فيديو' },
    'News': { es: 'Noticias', fr: 'Actualités', pt: 'Notícias', it: 'Notizie', ja: 'ニュース', zh: '新闻', ko: '뉴스', ru: 'Новости', hi: 'समाचार', ar: 'أخبار' },
    'Live': { es: 'En directo', fr: 'En direct', pt: 'Ao vivo', it: 'Dal vivo', ja: 'ライブ', zh: '直播', ko: '실시간', ru: 'Трансляции', hi: 'लाइव', ar: 'بث مباشر' },
    'Uploads': { es: 'Subidas', fr: 'Mises en ligne', pt: 'Envios', it: 'Caricamenti', ja: 'アップロード動画', zh: '上传的视频', ko: '업로드한 동영상', ru: 'Загрузки', hi: 'अपलोड', ar: 'التحميلات' },
    'My communities': { es: 'Mis comunidades', fr: 'Mes communautés', pt: 'Minhas comunidades', it: 'Le mie community', ja: 'マイコミュニティ', zh: '我的社区', ko: '내 커뮤니티', ru: 'Мои сообщества', hi: 'मेरे समुदाय', ar: 'مجتمعاتي' },
    'Reddit feeds': { es: 'Feeds de Reddit', fr: 'Flux Reddit', pt: 'Feeds do Reddit', it: 'Feed di Reddit', ja: 'Reddit フィード', zh: 'Reddit 动态', ko: 'Reddit 피드', ru: 'Ленты Reddit', hi: 'Reddit फ़ीड', ar: 'خلاصات Reddit' },
    'Popular posts': { es: 'Publicaciones populares', fr: 'Publications populaires', pt: 'Posts populares', it: 'Post popolari', ja: '人気の投稿', zh: '热门帖子', ko: '인기 게시물', ru: 'Популярные посты', hi: 'लोकप्रिय पोस्ट', ar: 'المنشورات الشائعة' },
    'Community Details': { es: 'Detalles de la comunidad', fr: 'Détails de la communauté', pt: 'Detalhes da comunidade', it: 'Dettagli della community', ja: 'コミュニティの詳細', zh: '社区详情', ko: '커뮤니티 세부 정보', ru: 'О сообществе', hi: 'समुदाय विवरण', ar: 'تفاصيل المجتمع' },
    'Google Search': { es: 'Buscar con Google', fr: 'Recherche Google', pt: 'Pesquisa Google', it: 'Cerca con Google', ja: 'Google 検索', zh: 'Google 搜索', ko: 'Google 검색', ru: 'Поиск в Google', hi: 'Google सर्च', ar: 'بحث Google' },
    'Trending Communities': { es: 'Comunidades en tendencia', fr: 'Communautés tendance', pt: 'Comunidades em alta', it: 'Community di tendenza', ja: 'トレンドのコミュニティ', zh: '热门社区', ko: '인기 커뮤니티', ru: 'Популярные сообщества', hi: 'ट्रेंडिंग समुदाय', ar: 'المجتمعات الرائجة' },
  };
  const lang = () => (document.documentElement?.lang || navigator.language || 'en').toLowerCase().split(/[-_]/)[0] || 'en';
  const clean = text => String(text || '').replace(/\s+/g, ' ').replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N})]+$/gu, '').trim().toLowerCase();
  let source = null, known = new Map();
  const english = text => {
    const words = globalThis.net19Theme?.words || null;
    if (words !== source) { source = words; known = new Map(Object.entries(words || {}).map(([local, label]) => [clean(local), label])); }
    return known.get(clean(text)) ?? text;
  };
  const say = label => { const l = lang(); return l === 'en' ? label : WORDS[label]?.[l] ?? null; };
  const onBody = run => {
    if (document.body) { run(); return; }
    new MutationObserver((_, observer) => { if (document.body) { observer.disconnect(); run(); } }).observe(document.documentElement, { childList: true });
  };
  const frame = run => {
    let queued = false;
    return () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; run(); }); };
  };
  const watch = (run, options = { childList: true, subtree: true }) => {
    const later = frame(run);
    onBody(() => { run(); new MutationObserver(later).observe(document.documentElement, options); });
    return later;
  };
  globalThis.net19 = { lang, say, english, onBody, frame, watch };
  globalThis.net19Lang = lang;
  globalThis.net19Say = say;
  globalThis.net19English = english;
})();
