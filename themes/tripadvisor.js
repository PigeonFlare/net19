globalThis.net19Theme = {
  light: { '#002b11': '#000a12', '#335541': '#4a4a4a', '#00eb5b': '#00a680', '#00852f': '#00a680' },
  dark: { '#002b11': '#000a12', '#335541': '#4a4a4a', '#00eb5b': '#00a680', '#00852f': '#00a680' },
};
(() => {
  const AI = /^\s*(Plan with AI|Ask AI|Build a trip with AI|Try AI)\s*$/i;
  const hide = () => {
    for (const node of document.querySelectorAll('header button, header a, form button, [data-automation^="topNav"] a, [data-automation^="topNav"] button')) {
      if (!AI.test(node.textContent || '')) continue;
      let target = node;
      while (target.parentElement && !target.parentElement.matches('header, nav, form, ul, body')
        && target.parentElement.textContent.trim() === node.textContent.trim()
        && !target.parentElement.querySelector('input, textarea, select')
        && target.parentElement.querySelectorAll('button, a').length <= 1) target = target.parentElement;
      if (!target.hasAttribute('data-net19-hidden')) target.setAttribute('data-net19-hidden', '');
    }
  };
  net19.watch(hide);
})();
