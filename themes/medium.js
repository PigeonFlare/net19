globalThis.net19Theme = { later: /^(?:get (?:the medium )?app|open in app|top highlight|listen|share this story with ai|summarize with ai|ask ai)$/i };
(() => {
  const mark = (el, name) => { if (el && el.getAttribute('data-n19-md') !== name) el.setAttribute('data-n19-md', name); };
  const run = () => {
    const clap = document.querySelector('[data-testid="headerClapButton"]');
    if (clap) {
      let bar = clap.parentElement;
      while (bar && bar !== document.body && !bar.querySelector('[data-testid="headerSocialShareButton"]')) bar = bar.parentElement;
      if (bar && bar !== document.body && !bar.querySelector('[data-testid="storyTitle"], [data-testid="authorName"]')) mark(bar, 'topbar');
    }
    const title = document.querySelector('[data-testid="storyTitle"]');
    const chip = title && document.querySelector('article button[aria-label^="Follow "]');
    let row = chip;
    for (let i = 0; row && i < 6; i++) { row = row.parentElement; if (row && row.querySelectorAll('button[aria-label^="Follow "]').length >= 2) break; }
    if (row && !row.contains(title) && row.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING) mark(row, 'topics');
    const name = document.querySelector('[data-testid="authorName"]');
    let byline = name?.parentElement;
    for (let i = 0; byline && i < 4 && !byline.querySelector('button'); i++) byline = byline.parentElement;
    for (const button of byline?.querySelectorAll('button') || []) if (globalThis.net19English?.(button.textContent.trim()) === 'Follow' || button.textContent.trim() === 'Follow') mark(button, 'follow');
    const signUp = document.querySelector('[data-testid="headerSignUpButton"]');
    if (signUp && globalThis.net19Lang?.() === 'en' && signUp.textContent.trim() === 'Sign up') {
      net19.rename(signUp, 'Sign up', globalThis.net19Say?.('Get started') || 'Get started');
    }
  };
  net19.watch(run);
})();
