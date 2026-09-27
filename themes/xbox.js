globalThis.net19Theme = {
  keep: 'div:has(> [class*="ProductDetailsHeader-module__backgroundImageContainer"]), .expandableSlider, section.hero > .slides > .slide',
  later: /^(?:need help\?\s*let['’]s chat|let['’]s chat|chat now|ask copilot|copilot|xbox copilot|gaming copilot)$/i,
};
(() => {
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
  let textsReady = false;
  const texts = root => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const list = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) list.push(n);
    return list;
  };
  const mark = el => {
    const had = el.getAttribute('data-n19-lime');
    if (had && /\bline\b/.test(had) && (el.textContent || '').trim()) el.setAttribute('data-n19-lime', had.replace(/\bline\b/, 'c'));
    if (seen.has(el)) return;
    seen.add(el);
    const s = getComputedStyle(el);
    const marks = [];
    if (LIME.test(s.backgroundColor)) marks.push('bg');
    if (LIME.test(s.color)) marks.push((el.textContent || '').trim() ? 'c' : 'line');
    if ((LIME.test(s.borderTopColor) && s.borderTopWidth !== '0px') || (LIME.test(s.borderBottomColor) && s.borderBottomWidth !== '0px') || (LIME.test(s.borderLeftColor) && s.borderLeftWidth !== '0px')) marks.push('bd');
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
    if (/Segoe Sans/i.test(s.fontFamily) && !el.hasAttribute('data-n19-sans')) el.setAttribute('data-n19-sans', '');
    if ((el.hasAttribute('data-n19-black') || /^\s*"?SegoeProBlack/i.test(s.fontFamily)) && el.childNodes.length) {
      el.setAttribute('data-n19-black', '');
      if (textsReady) for (const t of texts(el)) {
        const v = t.nodeValue;
        if (v.trim().length > 1 && v.length < 90 && !/[a-z]/.test(v) && /[A-Z]{2}/.test(v)) t.nodeValue = titleCase(v);
      }
    }
  };
  const brand = root => {
    for (const t of texts(root)) {
      const v = t.nodeValue;
      if (!v.includes('XBOX')) continue;
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
    const ready = () => setTimeout(() => { textsReady = true; scanAgain(); }, 1500);
    if (document.readyState === 'complete') ready(); else addEventListener('load', ready, { once: true });
  };
  const scanAgain = () => { for (const el of document.body.querySelectorAll(SEL)) seen.delete(el); scan([document.body]); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
