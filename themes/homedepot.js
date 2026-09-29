globalThis.net19Theme = { later: /^View Similar$/ };
(() => {
  const WORDS = [['[data-testid="header-button-Account"] p', /^(Log In|Account)$/, 'My Account']];
  const fix = () => {
    for (const [selector, from, to] of WORDS) {
      const el = document.querySelector(selector);
      const text = el?.firstChild;
      if (text?.nodeType === 3 && from.test(text.data.trim())) text.data = to;
    }
    for (const input of document.querySelectorAll('form#header-search input')) if (input.placeholder && input.placeholder !== 'What can we help you find today?') input.placeholder = 'What can we help you find today?';
  };
  net19.watch(fix, { childList: true, subtree: true, characterData: true });
})();
