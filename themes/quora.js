globalThis.net19Theme = {
  detect: () => document.body?.classList.contains('q-color-mode--dark') ? 'dark' : 'light',
  watch: ['class'],
  later: /^(?:try quora\+?|join quora\+?|subscribe to quora\+?|get quora\+?|quora\+ content|poe|try poe|open in poe|chat with poe|ask poe|ask assistant|assistant|continue in poe|dark mode)$/i,
};
(() => {
  const LABELS = { '/': 'Home', '/answer': 'Answer', '/spaces': 'Spaces', '/notifications': 'Notifications' };
  const labels = () => {
    for (const a of document.querySelectorAll('.spacing_log_header_nav a[href]')) {
      const path = new URL(a.href, location.href).pathname;
      const label = LABELS[path];
      if (!label || a.querySelector('[data-n19-label]') || a.textContent.trim()) continue;
      const span = document.createElement('span'); span.setAttribute('data-n19-label', ''); span.textContent = label;
      (a.querySelector('.q-flex, .q-inlineFlex, div') || a).append(span);
    }
  };
  const assistant = () => {
    for (const img of document.querySelectorAll('img[src*="poe.multibot"], img[src*="images.poe"], img[src*="poe_"]')) {
      const item = img.closest('[class*="dom_annotate_question_answer_item"], [class*="dom_annotate_multifeed_bundle"]');
      if (item && !item.hasAttribute('data-n19-ai')) item.setAttribute('data-n19-ai', '');
    }
  };
  const LATER_CONTROLS = /^(Downvote|All related \(\d+\)|Recommended|More answers below)$/;
  const controls = () => {
    for (const control of document.querySelectorAll('[role="button"], button')) {
      if (control.hasAttribute('data-net19-hidden')) continue;
      const label = (control.getAttribute('aria-label') || control.textContent).trim();
      if (LATER_CONTROLS.test(label)) control.setAttribute('data-net19-hidden', '');
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; labels(); assistant(); controls(); }); };
  const start = () => { labels(); assistant(); controls(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
