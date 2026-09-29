globalThis.net19Theme = (() => {
  const device = matchMedia('(prefers-color-scheme: dark)');
  const home = () => !!document.querySelector('.main-content > .banner > .banner__bd');
  return { detect: () => home() ? (device.matches ? 'dark' : 'light') : undefined };
})();
(() => {
  const LINES = ['Connecting a billion people with', 'calls, chats, and more'];
  const LATER = /^(Newsroom|Safety Center|Contact Us|Weixin)$/i;
  const fix = () => {
    const lines = document.querySelectorAll('.banner__bd .banner__desc');
    lines.forEach((line, i) => { if (LINES[i] && line.childElementCount === 0 && line.textContent !== LINES[i]) line.textContent = LINES[i]; });
    for (const link of document.querySelectorAll('.links__list a, .footer a, .banner .lang_change a, .banner a')) {
      const text = link.textContent.trim();
      const hide = LATER.test(text) || /linkedin\.com/i.test(link.getAttribute('href') || '');
      if (!hide) continue;
      const item = link.closest('li') || link;
      if (!item.hasAttribute('data-net19-hidden')) item.setAttribute('data-net19-hidden', '');
    }
  };
  const start = () => { fix(); new MutationObserver(() => requestAnimationFrame(fix)).observe(document.documentElement, { childList: true, subtree: true }); };
  const settle = () => setTimeout(start, 800);
  if (document.readyState === 'complete') settle(); else addEventListener('load', settle, { once: true });
})();
