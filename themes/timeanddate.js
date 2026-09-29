globalThis.net19Theme = {
  intended: '.feedback-bar__wrap, footer .footer-card, footer nav.footer__links-block--services, footer nav.footer__links-block--sites',
  later: /^(?:news|rss feeds)$/i,
};
(() => {
  const COLORS = [
    [/calculat|timer|countdown|rechner/i, '#ed1c66'], [/sun|moon|space|astronom|eclipse|sonne|mond/i, '#ffc907'],
    [/weather|wetter/i, '#3fa2a1'], [/app/i, '#8f4bc7'], [/calendar|holiday|kalender|feiertag/i, '#da0a06'],
    [/zone/i, '#79ba43'], [/time|clock|uhr|zeit/i, '#209dd9'],
  ];
  const fix = () => {
    for (const box of document.querySelectorAll('.tad-explore-box:not([data-n19-color])')) {
      const title = box.querySelector('.tad-explore-box__heading')?.textContent || '';
      const hit = COLORS.find(([re]) => re.test(title));
      if (!hit) continue;
      box.style.setProperty('--n19-section', hit[1]);
      box.setAttribute('data-n19-color', '');
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
