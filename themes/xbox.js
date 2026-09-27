// net19 handmade theme: Xbox, 2019. xbox.com has no light/dark setting: most pages paint a white body (they read as
// light and palette.js flips them on a dark device); a page that paints a dark body reads as dark. Palette tokens live
// in xbox.css.
// The 2023 brand is undone by what elements show, since it is set in many stylesheets: text in Segoe Pro Black is marked
// data-n19-black, lime (#9bf00b) text, backgrounds and borders data-n19-lime, and all-capitals titles set in Segoe Pro
// Black are written in 2019's mixed case ("XBOX GAME PASS" -> "Xbox Game Pass"); "XBOX" in menus and links reads "Xbox".
globalThis.net19Theme = {
  // Parts drawn for the picture behind them stay as drawn in a flipped page:
  //  - the store product header over the game's key art (title, rating and buttons over the dimmed picture), as the
  //    dark store pages flip to the white 2019 page on a light device;
  //  - the MWF slider's white box, always covered by its pictures (named so it is never flipped again inside the kept
  //    dark hero, which would turn the hero's white title black);
  //  - the 2025 home's hero slides (a light slide inside the kept dark page would otherwise flip again, text and all,
  //    while its key art stays as drawn).
  keep: 'div:has(> [class*="ProductDetailsHeader-module__backgroundImageContainer"]), .expandableSlider, section.hero > .slides > .slide',
  // The Copilot store assistant (2023) and other post-2019 entry points, by label
  later: /^(?:need help\?\s*let['’]s chat|let['’]s chat|chat now|ask copilot|copilot|xbox copilot|gaming copilot)$/i,
};
(() => {
  // lime: #9bf00b (2023) and #90f910 (the 2025 home), a yellow-green no 2019 color comes near
  const LIME = { test: c => { const m = /^rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)$/.exec(c); return !!m && (m[4] === undefined || +m[4] > .3) && +m[1] >= 120 && +m[1] <= 180 && +m[2] >= 225 && +m[3] <= 50; } };
  const SMALL = new Set(['a', 'an', 'and', 'at', 'by', 'for', 'from', 'in', 'of', 'on', 'or', 'the', 'to', 'with', 'your', 'you']);
  const KEEP = /^(?:PC|TV|FPS|RPG|DLC|VR|EA|FC|NBA|NFL|NHL|UFC|MLB|WWE|II|III|IV|4K|8K|HDR|X\|S|S|X|DOOM|ID@XBOX|FAQ|MS|AAA|UK|US|USA|EU|RTX|AMD|OK)$/;
  const word = (w, first) => {
    if (w === 'XBOX') return 'Xbox';
    if (KEEP.test(w.replace(/[^\w|@]/g, '')) || /\d/.test(w)) return w;
    const lower = w.toLowerCase();
    if (!first && SMALL.has(lower)) return lower;
    return lower.replace(/^([^a-z]*)([a-z])/, (_, pre, c) => pre + c.toUpperCase());
  };
  const titleCase = text => text.replace(/[^\s]+/g, (w, i) => word(w, !text.slice(0, i).trim() || /[:.!?]\s*$/.test(text.slice(0, i))));
  const seen = new WeakSet();
  // Text is rewritten only once the page has loaded and its app has taken over the server-drawn markup: changing text
  // before React hydrates it makes React throw that markup away (the games page lost its hero).
  let textsReady = false;
  const texts = root => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const list = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) list.push(n);
    return list;
  };
  const mark = el => {
    // a lime element that was empty when judged (a bar) and has since been given text is a lime label
    const had = el.getAttribute('data-n19-lime');
    if (had && /\bline\b/.test(had) && (el.textContent || '').trim()) el.setAttribute('data-n19-lime', had.replace(/\bline\b/, 'c'));
    if (seen.has(el)) return;
    seen.add(el);
    const s = getComputedStyle(el);
    const marks = [];
    if (LIME.test(s.backgroundColor)) marks.push('bg');
    if (LIME.test(s.color)) marks.push((el.textContent || '').trim() ? 'c' : 'line');
    if ((LIME.test(s.borderTopColor) && s.borderTopWidth !== '0px') || (LIME.test(s.borderBottomColor) && s.borderBottomWidth !== '0px') || (LIME.test(s.borderLeftColor) && s.borderLeftWidth !== '0px')) marks.push('bd');
    // the chevron after a link or button ("Shop consoles ›") is drawn by ::after in lime
    if (el.tagName === 'A' || el.tagName === 'BUTTON') {
      const after = getComputedStyle(el, '::after');
      if (after.content !== 'none' && LIME.test(after.color)) marks.push('after');
      if (after.content !== 'none' && LIME.test(after.backgroundColor)) marks.push('afterbg');
      const before = getComputedStyle(el, '::before');
      if (before.content !== 'none' && LIME.test(before.color)) marks.push('before');
      if (before.content !== 'none' && LIME.test(before.backgroundColor)) marks.push('beforebg');
    }
    if (had) for (const m of had.split(' ')) if (!marks.includes(m) && !(m === 'line' && marks.includes('c'))) marks.push(m);
    if (marks.length && marks.join(' ') !== had) el.setAttribute('data-n19-lime', marks.join(' '));
    // Segoe Sans (2024) in the newer page parts: Segoe UI, at the weight the part asks for
    if (/Segoe Sans/i.test(s.fontFamily) && !el.hasAttribute('data-n19-sans')) el.setAttribute('data-n19-sans', '');
    if ((el.hasAttribute('data-n19-black') || /^\s*"?SegoeProBlack/i.test(s.fontFamily)) && el.childNodes.length) {
      el.setAttribute('data-n19-black', '');
      // An all-capitals title set in Segoe Pro Black was a mixed-case Segoe UI title in 2019
      if (textsReady) for (const t of texts(el)) {
        const v = t.nodeValue;
        if (v.trim().length > 1 && v.length < 90 && !/[a-z]/.test(v) && /[A-Z]{2}/.test(v)) t.nodeValue = titleCase(v);
      }
    }
  };
  // "XBOX" as a word in menus, links and headings: 2019 wrote "Xbox"
  const brand = root => {
    for (const t of texts(root)) {
      const v = t.nodeValue;
      if (!v.includes('XBOX')) continue;
      // an all-capitals phrase in another typeface is a styled label ("XBOX GAME PASS" on a badge): left whole
      if (!/[a-z]/.test(v) && v.trim().split(/\s+/).length > 1) continue;
      const p = t.parentElement;
      if (!p || p.closest('script, style, textarea, [contenteditable]')) continue;
      t.nodeValue = v.replace(/\bXBOX\b/g, 'Xbox');
    }
  };
  const SEL = 'a, button, span, p, h1, h2, h3, h4, h5, h6, li, div[class*="banner"], div[class*="jump"], [class*="c-call-to-action"], [class*="heading"]';
  const scan = roots => {
    for (const root of roots) {
      if (!root?.isConnected || root.nodeType !== 1) continue;
      if (root.matches(SEL)) mark(root);
      for (const el of root.querySelectorAll(SEL)) mark(el);
      if (textsReady) brand(root);
    }
    // the tab title too ("XBOX Games | XBOX" -> "Xbox Games | Xbox")
    if (textsReady && /\bXBOX\b/.test(document.title)) document.title = document.title.replace(/\bXBOX\b/g, 'Xbox');
  };
  let pending = [], queued = false;
  const flush = () => { queued = false; const roots = pending; pending = []; scan(roots); };
  const start = () => {
    scan([document.body]);
    new MutationObserver(records => {
      for (const r of records) {
        if (r.type === 'childList') { for (const n of r.addedNodes) if (n.nodeType === 1) pending.push(n); else if (n.nodeType === 3 && n.parentElement) pending.push(n.parentElement); }
        else if (r.type === 'characterData' && r.target.parentElement) pending.push(r.target.parentElement);
        else if (r.type === 'attributes' && r.target.nodeType === 1) {
          // A state change (the active carousel dot, a stuck menu bar) can take lime away or bring it: marks on the
          // element and inside it are dropped and judged again before the next paint
          const el = r.target;
          const marked = el.hasAttribute('data-n19-lime') ? [el] : [];
          for (const m of el.querySelectorAll('[data-n19-lime]')) { if (marked.length > 60) break; marked.push(m); }
          for (const m of marked) { m.removeAttribute('data-n19-lime'); seen.delete(m); }
          if (el.matches(SEL)) seen.delete(el);
          pending.push(el);
        }
      }
      if (pending.length && !queued) { queued = true; requestAnimationFrame(flush); }
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class', 'aria-selected', 'aria-current', 'aria-pressed', 'aria-expanded'] });
    // Fonts and late stylesheets change what elements show: judge the page once more after load
    const ready = () => setTimeout(() => { textsReady = true; scanAgain(); }, 1500);
    if (document.readyState === 'complete') ready(); else addEventListener('load', ready, { once: true });
  };
  const scanAgain = () => { for (const el of document.body.querySelectorAll(SEL)) seen.delete(el); scan([document.body]); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
