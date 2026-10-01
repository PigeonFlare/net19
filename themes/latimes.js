globalThis.net19Theme = {
  later: /^(?:like this content|listen to this content|click here to listen to this article|live stream)$/i,
  intended: '[data-n19-later], #coral_talk_stream, gn-quicklinks li:has(> a[href*="/lifestyle/image"]), footer li:has(> a[href^="https://join.latimes.com"])',
};
(() => {
  const fix = root => {
    for (const el of (root.querySelectorAll ? root : document).querySelectorAll('.promo *, .promo-category')) {
      if (el.childElementCount > 2 || el.hasAttribute('data-net19-hidden')) continue;
      if (/^\s*for subscribers\s*$/i.test(el.textContent || '')) (el.closest('.promo-category, .promo-label') || el).setAttribute('data-net19-hidden', '');
    }
    for (const title of document.querySelectorAll('.promo-title, .promo-author-title')) {
      if (/^\s*(LATMG Streaming Now|LA Times Media Group Streaming|Real-time camera feeds|Get the L\.A\. Times app|Wordflower|Mini Crossword|Midi Crossword|Sudoku|Word Search)/i.test(title.textContent || '')) title.closest('.promo')?.setAttribute('data-n19-later', '');
    }
    for (const link of document.querySelectorAll('gn-quicklinks a[href$="/voices"], [data-element="navigation-menu"] a[href$="/voices"]')) {
      if (link.textContent.trim() === 'Voices') for (const node of link.childNodes) if (node.nodeType === 3 && node.textContent.trim() === 'Voices') node.textContent = node.textContent.replace('Voices', 'Opinion');
    }
  };
  net19.watch(() => fix(document));
})();
