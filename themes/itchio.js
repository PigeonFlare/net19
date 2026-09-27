globalThis.net19Theme = {};
(() => {
  const fix = () => {
    for (const a of document.querySelectorAll('.header_widget a.header_button[href$="/devlogs"]')) {
      const text = [...a.childNodes].find(n => n.nodeType === 3 && /Developer Logs/.test(n.textContent));
      if (text) text.textContent = text.textContent.replace('Developer Logs', 'Devlogs');
    }
    for (const input of document.querySelectorAll('.header_widget form.game_search input.search_input')) {
      if (/tags|jams/i.test(input.placeholder)) input.placeholder = 'Search for games or creators';
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fix, { once: true }); else fix();
})();
