globalThis.net19Theme = {
  later: /^(?:ask the post(?: ai)?|ask a question|listen(?: to (?:this )?(?:article|story))?|listen \d+ min|make us preferred on google|gift(?: this)? article|gift an article|wp intelligence)$/i,
};
(() => {
  const ASK = /ask (?:a question|the post)/i;
  const fix = () => {
    for (const label of document.querySelectorAll('[data-testid="input-text-container"] label')) {
      if (ASK.test(label.textContent || '')) label.textContent = 'Search';
    }
    for (const el of document.querySelectorAll('[data-testid="article-actions-bar"] :is(span, div, p):not([data-net19-hidden])')) {
      if (!el.firstElementChild && /^\s*\d+\s*min(?:\s*read)?\s*$/i.test(el.textContent || '')) el.setAttribute('data-net19-hidden', '');
    }
    for (const head of document.querySelectorAll('p[data-testid="article-header"]:not([data-net19-hidden])')) {
      if (!/what readers are saying/i.test(head.textContent || '')) continue;
      const scope = head.parentElement;
      const note = scope && [...scope.querySelectorAll('span, p')].find(el => /AI-generated/i.test(el.textContent || '') && !el.firstElementChild);
      if (!note) continue;
      let box = note;
      while (box.parentElement && box.parentElement !== scope && !box.parentElement.contains(head) &&
        !box.parentElement.querySelector('[data-qa="comments-btn"], input, textarea, [contenteditable]')) box = box.parentElement;
      box.setAttribute('data-net19-hidden', '');
      head.setAttribute('data-net19-hidden', '');
    }
    for (const h of document.querySelectorAll('h3:not([data-net19-seen])')) {
      if (!/^\s*conversation summary\s*$/i.test(h.textContent || '')) continue;
      h.setAttribute('data-net19-seen', '');
      const box = h.closest('section');
      if (box && /automatically generated/i.test(box.textContent || '') && !box.querySelector('input, textarea, [contenteditable], button[aria-label*="comment" i]')) box.setAttribute('data-net19-hidden', '');
    }
    if (/^Ask The Post AI/.test(document.title)) document.title = document.title.replace(/^Ask The Post AI/, 'Search');
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true, characterData: true }); addEventListener("load", later); };
  if (document.body) start();
  else new MutationObserver((_, o) => { if (document.body) { o.disconnect(); start(); } }).observe(document.documentElement || document, { childList: true, subtree: true });
})();
