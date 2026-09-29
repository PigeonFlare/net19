globalThis.net19Theme = { later: /^(?:u\.s\. news decision points|decision points|u\.s\. news live)$/i, intended: '[data-net19-hidden], .bx-client, [id^="bx-campaign-"], iframe.bx-gbi-frame' };
(() => {
  const LOGIN = /^\s*Create an Account or Login\s*$/i;
  const fix = () => {
    for (const h of document.querySelectorAll('h4:not([data-net19-seen])')) {
      if (!LOGIN.test(h.textContent || '')) continue;
      h.setAttribute('data-net19-seen', '');
      let box = h;
      for (let n = h.parentElement; n && n !== document.body; n = n.parentElement) { box = n; if (/fixed|absolute/.test(getComputedStyle(n).position)) break; }
      box.setAttribute('data-net19-hidden', '');
    }
  };
  net19.watch(fix);
})();
