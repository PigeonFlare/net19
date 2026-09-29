globalThis.net19Theme = {
  intended: '.pubmed-updates-section, .region-site-alert, [data-n19-later]',
  later: /^(?:virtual tour|press room|nih website archives|careers|blog|github|linkedin|connect with nlm|rss|take the virtual tour|recover)$/i,
};
(() => {
  const root = document.documentElement;
  const www = location.hostname === 'www.nih.gov' || location.hostname === 'nih.gov';
  if (www) root.setAttribute('data-n19-www', '');
  const fix = () => {
    if (www) {
      const header = document.querySelector('header.usa-header--extended');
      if (header && !header.hasAttribute('data-n19-label')) header.setAttribute('data-n19-label', 'U.S. Department of Health & Human Services');
    }
    for (const heading of document.querySelectorAll('h2, h3')) {
      if (!/^\s*Experimental Resource\s*$/i.test(heading.textContent)) continue;
      const block = heading.parentElement;
      if (block && block.querySelectorAll('a, button').length <= 3 && !block.hasAttribute('data-n19-later')) block.setAttribute('data-n19-later', '');
    }
    for (const img of document.querySelectorAll('img[src*="pubmed-logo-white.svg"]')) img.src = img.src.replace('pubmed-logo-white.svg', 'pubmed-logo-blue.svg');
  };
  const later = net19.watch(fix);
})();
