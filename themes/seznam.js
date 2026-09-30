globalThis.net19Theme = { intended: '[data-n19-later], .mol-trending-topics-popup-card' };
(() => {
  const mark = el => { if (el && !el.hasAttribute('data-n19-later')) el.setAttribute('data-n19-later', ''); };
  const topBlock = (el, stop) => { let n = el; while (n.parentElement && n.parentElement !== stop && !n.parentElement.matches(stop)) n = n.parentElement; return n; };
  const fix = () => {
    const left = document.querySelector('.Layout--left');
    if (left) for (const node of left.querySelectorAll('div, p, span')) {
      if (node.children.length > 3 || !/shrnutí výsledků|Shrnutí od AI|AI shrnutí/i.test(node.textContent || '')) continue;
      mark(topBlock(node, '.Layout--left'));
      break;
    }
    for (const button of document.querySelectorAll('button')) {
      const text = (button.textContent || '').trim();
      if (/^Ohodnoťte výsledky hledání$/.test(text)) mark(button.parentElement);
      else if (text === 'Podcasty') mark(button.closest('li') || button);
    }
    for (const field of document.querySelectorAll('textarea[placeholder="Popište, co se vám zdálo"]')) mark(field.closest('form, [role="dialog"]') || field);
  };
  const later = net19.watch(fix);
})();
