// net19 handmade theme: washingtonpost. The site follows the device's light/dark setting with its own dark palette,
// which palette.js reads from the page background. "Ask The Post AI" (2024) and its question-style search label, the
// audio "Listen" control and the Google "preferred source" link are post-2019; the search field's floating label is
// a <label>, not a placeholder, so it is rewritten here to plain "Search". The AI "What readers are saying" and "Conversation
// Summary" comment summaries (2024) and the reading-time label (2021) are hidden by their text.
globalThis.net19Theme = {
  later: /^(?:ask the post(?: ai)?|ask a question|listen(?: to (?:this )?(?:article|story))?|listen \d+ min|make us preferred on google|gift(?: this)? article|gift an article|wp intelligence)$/i,
};
(() => {
  const ASK = /ask (?:a question|the post)/i;
  const fix = () => {
    for (const label of document.querySelectorAll('[data-testid="input-text-container"] label')) {
      if (ASK.test(label.textContent || '')) label.textContent = 'Search';
    }
    // Reading-time labels ("4 min", 2021) beside the share tools
    for (const el of document.querySelectorAll('[data-testid="article-actions-bar"] :is(span, div, p):not([data-net19-hidden])')) {
      if (!el.firstElementChild && /^\s*\d+\s*min(?:\s*read)?\s*$/i.test(el.textContent || '')) el.setAttribute('data-net19-hidden', '');
    }
    // "What readers are saying" (2024): an AI-generated summary of the comments, drawn beside the comment button. Its
    // heading and the summary block (the widest part that holds neither the heading nor the button) are hidden.
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
    // The comments drawer's AI "Conversation Summary" (2024)
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
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true }); addEventListener("load", later); };
  // Start as soon as <body> exists (as palette.js does; DOMContentLoaded can come too late on streamed pages)
  if (document.body) start();
  else new MutationObserver((_, o) => { if (document.body) { o.disconnect(); start(); } }).observe(document.documentElement || document, { childList: true, subtree: true });
})();
