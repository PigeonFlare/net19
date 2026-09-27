// net19 handmade theme: itch.io, 2019. The design is essentially the 2019 one; only the header's wording changed since:
// "Developer Logs" was "Devlogs" and the search field said "Search for games or creators". itch.io is a light site
// with no dark mode of its own, so its mode is read from the page (palette.js's default) and a dark device flips it.
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
