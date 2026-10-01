globalThis.net19Theme = {
  intended: '[data-n19-later]',
  later: /^Non-AI$/i,
  light: { '#018670': '#02a388' },
  dark: { '#018670': '#2cc3a5' },
};
(() => {
  const TEXT = [[/^Amazing imagery, always AI free$/i, 'Less searching. More finding.'], [/^iStock doesn.t allow any AI-generated visuals/i, 'Discover royalty-free images, illustrations and videos that will make you stand out.']];
  const mark = () => {
    for (const span of document.querySelectorAll('[data-testid="workbench-basic-hero"] span[data-testid="sanitizedString"]')) {
      for (const [from, to] of TEXT) if (from.test(span.textContent.trim())) span.textContent = to;
    }
    for (const box of document.querySelectorAll('section.headline')) {
      if (!box.hasAttribute('data-n19-later') && /free from AI-generated content/i.test(box.textContent)) box.setAttribute('data-n19-later', '');
    }
    for (const h of document.querySelectorAll('.promo-banner .banner-headline h2, .promo-banner h2')) {
      const banner = h.closest('.promo-banner');
      if (banner && !banner.hasAttribute('data-n19-later') && /^Inclusive Storytelling$/i.test(h.textContent.trim())) banner.setAttribute('data-n19-later', '');
    }
  };
  const later = net19.frame(mark);
  mark();
  new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
