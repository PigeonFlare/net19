globalThis.net19Theme = { later: /^(?:listen(?: to (?:this )?article)?(?: · [0-9:]+ min)?|share full article|gift (?:this )?article|read in app|open in app|play (?:wordle|connections|spelling bee|the mini|strands)|the athletic)$/i };
(() => {
  const READ = /^\s*\d+\s+min\s+read\s*$/i;
  const fix = () => {
    for (const p of document.querySelectorAll('.story-wrapper p:not([data-net19-hidden])')) {
      if (!p.firstElementChild && READ.test(p.textContent || '')) p.setAttribute('data-net19-hidden', '');
    }
  };
  net19.watch(fix);
})();
