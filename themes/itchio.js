globalThis.net19Theme = {
  intended: 'a.youtube_banner, .youtube_game_promo_banner_widget .youtube_link, section#devlog.game_devlog p:has(> a.forward_link[href$="/devlog"]), #user_tools li:has(> a.related_games_btn)',
};
(() => {
  const RENAMES = [['Developer Logs', 'Devlogs'], ['Albums & soundtracks', 'Soundtracks']];
  const fix = () => {
    for (const a of document.querySelectorAll('.header_widget a.header_button[href$="/devlogs"], .filter_options a[data-value="soundtrack"], a[href="/soundtracks"], .index_header_tabs a')) {
      for (const text of [...a.childNodes].filter(n => n.nodeType === 3)) {
        for (const [from, to] of RENAMES) if (text.textContent.includes(from)) text.textContent = text.textContent.replace(from, to);
      }
    }
    for (const input of document.querySelectorAll('.header_widget form.game_search input.search_input')) {
      if (/tags|jams/i.test(input.placeholder)) input.placeholder = 'Search for games or creators';
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fix, { once: true }); else fix();
})();
