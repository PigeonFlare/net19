(() => {
  const gray = {
    '#fbfbf9': '#fafafa', '#f6f6f3': '#f5f5f5', '#efefeb': '#ececec', '#ebebe5': '#e9e9e9', '#e5e5e0': '#efefef', '#e9e9e4': '#efefef', '#dadad3': '#e2e2e2',
    '#cecec5': '#d0d0d0', '#c8c8c1': '#cdcdcd', '#bcbcb3': '#c4c4c4', '#b0b0a6': '#b0b0b0', '#91918c': '#8e8e8e', '#85857f': '#838383',
    '#787873': '#787878', '#74746c': '#767676', '#676760': '#6a6a6a', '#62625b': '#767676', '#5a5a54': '#5a5a5a', '#55554f': '#5f5f5f',
    '#494943': '#4a4a4a', '#474742': '#474747', '#3b3b36': '#3c3c3c', '#33332e': '#333333', '#2d2d29': '#2d2d2d', '#262622': '#262626',
    '#242421': '#242424', '#181816': '#181818', '#10100f': '#101010',
  };
  globalThis.net19Theme = {
    light: { ...gray, '#211922': '#333333' }, dark: gray,
    later: /^(?:less ai|more ai|refine|refine your search|inspire me|ask pinterest|shuffles|collage|create collage|make a collage|cutout|create cutout|remix|shop|shop the look|explore|today|create|create pin|create idea pin|pinterest predicts|see ai modified|ai modified|ai-modified|gen ai|tune your home feed)$/i,
    keepLabels: /^(?:home|notifications|updates|messages|save|search|log in|sign up|more options)$/i,
    keep: ':is([data-test-id="login-button"], [data-test-id="simple-login-button"]) button, [data-n19-pin="card"] button[type="submit"], [data-test-id="pin-save-button"] :is(button, [role="button"])',
  };
})();
(() => {
  const root = document.documentElement;
  const site = /^(business|help|newsroom)\./.exec(location.hostname);
  if (site) root.setAttribute('data-n19-pin-site', site[1]);
  const sheet = document.createElement('style');
  sheet.id = 'net19-pinterest-layout';
  let railWidth = '';
  const mark = (el, name) => { if (el && el.getAttribute('data-n19-pin') !== name) el.setAttribute('data-n19-pin', name); };
  const fix = () => {
    const rail = document.getElementById('VerticalNavContent');
    const box = document.getElementById('searchBoxContainer');
    if (rail) {
      const right = Math.ceil(rail.getBoundingClientRect().right) + 8;
      const w = `${Math.max(80, Math.min(right, 480))}px`;
      if (w !== railWidth) { railWidth = w; sheet.textContent = `html{--n19-rail:${w}}`; }
      if (!sheet.isConnected) (document.head || root).append(sheet);
    }
    if (box) for (let e = box.parentElement; e && e !== document.body; e = e.parentElement) {
      if (getComputedStyle(e).position === 'fixed') { mark(e, 'header'); break; }
    }
    for (const start of document.querySelectorAll('#mweb-unauth-container, [data-test-id="masonry-container"], [data-test-id="CloseupMainPin"], [role="main"], main')) {
      for (let e = start; e && e !== document.body; e = e.parentElement) {
        if (e.hasAttribute('data-n19-pin')) break;
        const s = getComputedStyle(e);
        if (s.paddingLeft === '72px' || s.marginLeft === '72px') { mark(e, 'offset'); break; }
      }
    }
    if (globalThis.net19Lang?.() === 'en') for (const input of document.querySelectorAll('#searchBoxContainer input')) if (input.placeholder !== 'Search') input.placeholder = 'Search';
    for (const el of document.querySelectorAll('#searchBoxContainer [data-test-id="dynamic-search-placeholder"], #searchBoxContainer [data-test-id="searchBarPlaceholder"]')) mark(el, 'later');
    const signup = document.querySelector('[role="main"] form input[type="email"], [role="main"] form input[name="id"]')?.closest('form');
    const module = document.querySelector('[data-test-id^="homepage-section-"]');
    if (signup && module) {
      let list = module.parentElement;
      while (list && !list.contains(signup)) list = list.parentElement;
      if (list) {
        root.setAttribute('data-n19-pin-landing', '');
        for (const part of list.children) {
          if (part.contains(signup)) { mark(part, 'welcome'); continue; }
          if (part.tagName === 'FOOTER' || part.querySelector('footer')) continue;
          mark(part, 'later');
        }
        let card = signup.parentElement;
        while (card && card !== list && !(getComputedStyle(card).backgroundColor !== 'rgba(0, 0, 0, 0)' && parseFloat(getComputedStyle(card).borderTopLeftRadius) >= 8)) card = card.parentElement;
        if (card && card !== list) { mark(card, 'card'); mark(card.parentElement, 'card-row'); mark(card.parentElement?.parentElement, 'card-col'); }
        for (const heading of document.querySelectorAll('[data-n19-pin="welcome"] :is(h1, h2)')) if (/^Sign up to get/i.test(heading.textContent.trim())) mark(heading.parentElement?.childElementCount === 1 ? heading.parentElement : heading, 'later');
        if (settled && card) {
          const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
          for (let node = walker.nextNode(); node; node = walker.nextNode()) if (/^Join Pinterest for free to discover more ideas$/.test(node.nodeValue.trim())) node.nodeValue = 'Find new ideas to try';
        }
      }
    }
    for (const link of document.querySelectorAll('[data-test-id="unauth-header"] a, header a')) if (/^(Shop|Create)$/i.test(link.textContent.trim())) mark(link.parentElement?.childElementCount === 1 ? link.parentElement : link, 'later');
    for (const control of document.querySelectorAll('button, [role="button"]')) {
      const label = (control.getAttribute('aria-label') || control.textContent).trim();
      if (/^(Download image|QR code login button|Show filters)$/i.test(label)) mark(control, 'later');
      if (/^Close Bottom Right Upsell$/i.test(label)) {
        let box = control;
        while (box.parentElement && box.parentElement !== document.body && getComputedStyle(box).position !== 'fixed') box = box.parentElement;
        mark(box, 'later');
      }
    }
    for (const link of document.querySelectorAll('a')) if (/^(Notice at collection|Non-user notice)$/i.test(link.textContent.trim())) mark(link.parentElement?.childElementCount === 1 ? link.parentElement : link, 'later');
    for (const pill of document.querySelectorAll('[data-test-id="one-bar-pill"]')) {
      if (/^(?:less ai|more ai|ai|refine|inspire me)$/i.test(pill.textContent.trim())) mark(pill.closest('[data-test-id^="one-bar-module"]') || pill, 'later');
    }
  };
  let queued = false, settled = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const settle = () => setTimeout(() => { settled = true; later(); }, 1500);
  if (document.readyState === 'complete') settle(); else addEventListener('load', settle, { once: true });
  const start = () => {
    fix();
    new MutationObserver(later).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['placeholder'] });
    addEventListener('resize', later, { passive: true });
  };
  net19.onBody(start);
})();
(() => {
  const FAMILIES = ['Pin Sans', 'PinSans', 'PinterestSansPro', 'Pinterest Sans', 'Pinterest Sans Pro'];
  const face = (family, weight, bold) => `@font-face{font-family:"${family}";font-weight:${weight};font-style:normal;src:${bold
    ? 'local("HelveticaNeue-Bold"),local("Helvetica Neue Bold"),local("Helvetica-Bold"),local("Arial Bold"),local("Arial-BoldMT")'
    : 'local("HelveticaNeue"),local("Helvetica Neue"),local("Helvetica"),local("Arial"),local("ArialMT")'};}`;
  const css = FAMILIES.map(f => face(f, '100 550', false) + face(f, '551 1000', true)).join('');
  const add = () => {
    let node = document.getElementById('net19-pinterest-faces');
    if (!node) { node = document.createElement('style'); node.id = 'net19-pinterest-faces'; node.textContent = css; }
    if (document.head && document.head.lastElementChild !== node) document.head.append(node);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add, { once: true }); else add();
  addEventListener('load', add, { once: true });
})();
globalThis.net19Theme.words = {"Aviso de recopilación de información": "Notice at collection", "Explorar": "Explore", "Informations concernant la collecte de données": "Notice at collection", "Explorer": "Explore", "Avviso sulla raccolta": "Notice at collection", "Esplora": "Explore", "情報収集に関するお知らせ": "Notice at collection", "アイデアを探す": "Explore", "信息收集声明": "Notice at collection", "探索": "Explore", "컬렉션 알림": "Notice at collection", "탐색": "Explore", "संग्रह के दौरान नोटिस": "Notice at collection", "إشعار على المختارات": "Notice at collection", "استكشاف": "Explore"};
