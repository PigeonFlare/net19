// net19 handmade theme: Yandex (yandex.ru and its services), 2019.
// Each Yandex property is marked on <html data-n19-ya="serp|pogoda|translate|market|maps|other"> so rules can be scoped.
// The portal home (yandex.ru/) now redirects to dzen.ru, which is another company's site and is not themed.
globalThis.net19Theme = (() => {
  const host = location.hostname, path = location.pathname;
  const ya = /^translate\./.test(host) ? 'translate' : /^market\./.test(host) ? 'market'
    : /^\/(search|yandsearch)\b/.test(path) ? 'serp' : /^\/pogoda\b/.test(path) ? 'pogoda' : /^\/maps\b/.test(path) ? 'maps' : 'other';
  document.documentElement.setAttribute('data-n19-ya', ya);
  // Погода follows the device's light/dark setting itself; the theme repaints its page background, so the mode is read
  // from the site's text color (light text = dark mode) rather than from the background.
  const ink = () => {
    const m = /(\d+),\s*(\d+),\s*(\d+)/.exec(getComputedStyle(document.body || document.documentElement).color);
    return m ? (.2126 * m[1] + .7152 * m[2] + .0722 * m[3]) / 255 : 0;
  };
  return {
    detect: ya === 'pogoda' ? () => (ink() > .6 ? 'dark' : 'light') : undefined,
    // Alice (2017) existed, but its AI chat, "Нейро" (2024), YandexGPT (2023), Market AI and Translator AI did not.
    later: /^(?:спросить алису(?: ai)?|алиса ai|алиса про|нейро|нейроэксперт|спросить нейро|yandexgpt|yandex ?gpt|маркет ai|переводчик ai|спросить переводчик ai|шедеврум|ai-помощник|ai помощник|призы|колесо призов)$/i,
  };
})();
// Post-2019 features without a stable label or class: answers written by Нейро / Alice AI on the results page (one
// result slot each, never the list around them).
(() => {
  const ya = document.documentElement.getAttribute('data-n19-ya');
  const AI = /^(?:Нейро|Алиса AI|Ответ Алисы|Алиса|YandexGPT|Ответ нейросети)(?!\p{L})/u;
  const fix = () => {
    if (ya === 'serp') {
      for (const item of document.querySelectorAll('#search-result > li.serp-item, #search-result > li')) {
        if (item.hasAttribute('data-net19-hidden')) continue;
        // The feature's own heading or badge is at the top of the slot; ordinary results begin with a site title.
        const head = item.querySelector('h2, [class*="Title"], [class*="Header"]');
        const text = (head?.textContent || '').trim();
        if (AI.test(text) && !item.querySelector('.OrganicTitle-Link, a.Link.OrganicTitle-Link')) item.setAttribute('data-net19-hidden', '');
      }
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
