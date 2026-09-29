globalThis.net19Theme = (() => {
  const host = location.hostname, path = location.pathname;
  const ya = /^translate\./.test(host) ? 'translate' : /^market\./.test(host) ? 'market'
    : /^\/(search|yandsearch)\b/.test(path) ? 'serp' : /^\/pogoda\b/.test(path) ? 'pogoda' : /^\/maps\b/.test(path) ? 'maps'
    : /^(www\.)?(yandex\.[a-z.]+|ya\.ru)$/.test(host) && /^\/?$/.test(path) ? 'home' : 'other';
  document.documentElement.setAttribute('data-n19-ya', ya);
  document.documentElement.setAttribute('data-n19-ya-lang', /^en/i.test(document.documentElement.lang) || /\.com$/.test(host) ? 'en' : 'ru');
  const ink = () => {
    const m = /(\d+),\s*(\d+),\s*(\d+)/.exec(getComputedStyle(document.body || document.documentElement).color);
    return m ? (.2126 * m[1] + .7152 * m[2] + .0722 * m[3]) / 255 : 0;
  };
  return {
    detect: ['pogoda', 'serp', 'home'].includes(ya) ? () => (ink() > .6 ? 'dark' : 'light') : undefined,
    intended: '.alice-ai-button__wrapper, .alice-link__wrapper, .search3__voice-wrapper, .search3__camera_wrapper, .image-search, .HeaderDesktopActions-Cbir, [data-n19-ya-later]',
    later: /^(?:спросить алису(?: ai)?|алиса ai|алиса про|нейро|нейроэксперт|спросить нейро|yandexgpt|yandex ?gpt|маркет ai|переводчик ai|спросить переводчик ai|шедеврум|ai-помощник|ai помощник|призы|колесо призов|промптхаб)$/i,
  };
})();
(() => {
  const ya = document.documentElement.getAttribute('data-n19-ya');
  const AI = /^(?:Нейро|Алиса AI|Ответ Алисы|Алиса|YandexGPT|Ответ нейросети)(?!\p{L})/u;
  const lang = document.documentElement.getAttribute('data-n19-ya-lang');
  const CHROME_LATER = /^(?:финансы|квартиры|избранное|заказы|погода|меню|menu|favorites|orders|weather|finance|yandex ai|алиса ai|алиса|alice|commercial offers|коммерческие предложения|ya\.ru)$/i;
  const chromeLabel = el => (el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || '').replace(/\s+/g, ' ').trim();
  const fix = () => {
    for (const el of document.querySelectorAll('header a, header button, nav.HeaderNav a, footer.SerpFooter a, footer.SerpFooter button, .headline__personal a, .headline__personal [role=button]')) {
      if (el.hasAttribute('data-n19-ya-later')) continue;
      if (CHROME_LATER.test(chromeLabel(el))) el.setAttribute('data-n19-ya-later', '');
    }
    for (const field of document.querySelectorAll('form[role=search] :is(input, textarea)[placeholder]')) {
      if (/\bAI\b|алис|нейро/i.test(field.getAttribute('placeholder'))) field.setAttribute('placeholder', '');
    }
    for (const button of document.querySelectorAll('.search3__button:not([data-n19-label])')) button.setAttribute('data-n19-label', lang === 'en' ? 'Search' : 'Найти');
    if (ya === 'home' && !document.querySelector('.headline__personal-enter')) for (const menu of document.querySelectorAll('.headline__personal-menu:not([data-n19-label])')) menu.setAttribute('data-n19-label', lang === 'en' ? 'Log in' : 'Войти');
    if (ya === 'serp') {
      for (const item of document.querySelectorAll('#search-result > li.serp-item, #search-result > li')) {
        if (item.hasAttribute('data-net19-hidden')) continue;
        const head = item.querySelector('h2, [class*="Title"], [class*="Header"]');
        const text = (head?.textContent || '').trim();
        if (AI.test(text) && !item.querySelector('.OrganicTitle-Link, a.Link.OrganicTitle-Link')) item.setAttribute('data-net19-hidden', '');
      }
    }
  };
  const later = net19.watch(fix);
})();
