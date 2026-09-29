globalThis.net19Theme = {
  intended: 'a:is([aria-label="Buy me a coffee Twitter"], [aria-label="Buy me a coffee YouTube"], [aria-label="Buy me a coffee Instagram"]), a[href$="/reviews"], .video-picker-toggle-container, a.creator-card, [data-n19-later]',
};
(() => {
  const LATER_MENUS = /^(?:Apps|Resources)$/;
  const mark = () => {
    for (const trigger of document.querySelectorAll('.btn-hover-bg')) {
      if (!LATER_MENUS.test(trigger.textContent.trim())) continue;
      const menu = trigger.parentElement;
      if (menu && !menu.hasAttribute('data-n19-later')) menu.setAttribute('data-n19-later', '');
    }
  };
  const start = () => { mark(); setTimeout(mark, 1500); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();
