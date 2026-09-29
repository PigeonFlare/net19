globalThis.net19Theme = {
  detect: () => document.documentElement.classList.contains('__fb-dark-mode') ? 'dark' : 'light',
  watch: ['class'],
  later: /^(?:meta ai|ask meta ai|chat with meta ai|imagine|imagine with meta ai|generate(?: an)? (?:ai )?image|create (?:an )?ai image|ai images?|ai studio|ai characters?|create an ai|discover ais?|stories|your story|add to story|people|marketplace|communities|community chats?|create community|vanish mode|turn on vanish mode|change theme|theme|themes|chat themes?|your note|share a note|leave a note|notes|soundmoji|send a soundmoji)$/i,
  keepLabels: /^(?:chats|requests|archive|archived chats|message requests)$/i,
};
(() => {
  const E2EE = /end-to-end encrypt|secured with end-to-end|messages and calls are secured/i;
  const mark = el => { if (el && el.getAttribute('data-n19-msgr') !== 'later') el.setAttribute('data-n19-msgr', 'later'); };
  const LANDING = new Map([
    ['A place for meaningful conversations', 'Be together, whenever.'],
    ['Messenger helps you connect with your Facebook friends and family, build your community, and deepen your interests.', 'A simple way to text, video chat and plan things all in one place.'],
    ['Forgot password?', 'Forgot your password?'], ['Log in', 'Sign In'], ['Email or phone number', 'Email or Phone Number'], ['Privacy Policy', 'Data Policy'],
  ]);
  const landing = () => {
    if (!document.querySelector('#login_form, header._4n9r')) return;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.nodeValue.replace(/\s+/g, ' ').trim();
      const to = LANDING.get(text);
      if (to && !node.parentElement.closest('[role="main"] [role="grid"]')) node.nodeValue = to;
      else if (/^© Meta \d{4}$/.test(text)) node.nodeValue = '© Facebook 2019.';
    }
    for (const input of document.querySelectorAll('#login_form input[placeholder]')) { const to = LANDING.get(input.placeholder); if (to) input.placeholder = to; }
    for (const li of document.querySelectorAll('header._4n9r li')) if (/^(?:Privacy and Safety|Help Center)$/.test(li.textContent.trim())) mark(li);
    for (const a of document.querySelectorAll('a[href*="/policy/cookies"], a[href*="?locale="]')) mark(a.closest('li') || a);
    for (const img of document.querySelectorAll('img[alt="From Meta Logo"]')) mark(img.parentElement?.childElementCount === 1 ? img.parentElement : img);
    for (const el of document.querySelectorAll('[class*="messengerMarketingTrademark"] span')) if (/^English/.test(el.textContent.trim())) mark(el.closest('div') || el);
  };
  const fix = () => {
    landing();
    for (const field of document.querySelectorAll('input[type="search"][placeholder], [role="navigation"] input[placeholder]')) {
      if (/meta ai/i.test(field.placeholder) || (field.placeholder === 'Search' && field.closest('[role="navigation"]'))) field.placeholder = 'Search Messenger';
    }
    for (const h of document.querySelectorAll('[role="navigation"] h1')) {
      const t = h.querySelector('span:not(:has(*))') || h;
      if (!t.querySelector('*') && t.textContent.trim() === 'Chats') t.textContent = 'Messenger';
    }
    const main = document.querySelectorAll('[role="main"]');
    for (const root of main) {
      for (const el of root.querySelectorAll('span, div')) {
        if (el.firstElementChild || el.hasAttribute('data-n19-msgr')) continue;
        const text = el.textContent.trim();
        if (text === 'Edited') { mark(el); continue; }
        if (text.length < 200 && E2EE.test(text)) {
          let block = el;
          while (block.parentElement && block.parentElement !== root && block.parentElement.textContent.trim().length <= text.length + 40
            && !block.parentElement.querySelector('input, textarea, [contenteditable="true"]')) block = block.parentElement;
          mark(block);
        }
      }
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; setTimeout(() => requestAnimationFrame(() => { queued = false; fix(); }), 120); };
  const start = () => {
    fix();
    new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['placeholder'] });
  };
  net19.onBody(start);
})();
globalThis.net19Theme.words = {"Política de cookies": "Cookie Policy", "Politique d’utilisation des cookies": "Cookie Policy", "Política de Cookies": "Cookie Policy", "Normativa sui cookie": "Cookie Policy", "Cookieポリシー": "Cookie Policy", "Cookie 政策": "Cookie Policy", "쿠키 정책": "Cookie Policy", "Политика в отношении файлов cookie": "Cookie Policy", "कुकी पॉलिसी": "Cookie Policy", "سياسة ملفات تعريف الارتباط": "Cookie Policy"};
