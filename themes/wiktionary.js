globalThis.net19Theme = {};
(() => {
  if (!/^[a-z-]+\.wiktionary\.org$/.test(location.hostname) || location.hostname === 'www.wiktionary.org') return;
  const root = document.documentElement;
  const url = new URL(location.href);
  const skinnable = u => u.origin === location.origin && !u.searchParams.has('useskin') &&
    (u.pathname.startsWith('/w/index.php') || u.pathname.startsWith('/wiki/')) &&
    !/^(edit|submit|raw|render)$/.test(u.searchParams.get('action') || '') && !u.searchParams.has('veaction');
  if (skinnable(url)) {
    url.searchParams.set('useskin', 'vector');
    root.setAttribute('data-net19-reskin', '');
    const check = () => {
      if (document.body?.classList.contains('skin-vector-2022')) location.replace(url.href);
      else root.removeAttribute('data-net19-reskin');
    };
    if (document.body) check(); else document.addEventListener('DOMContentLoaded', check, { once: true });
    setTimeout(() => root.removeAttribute('data-net19-reskin'), 4000);
  }
  const carry = event => {
    const a = event.target.closest?.('a[href]');
    if (!a) return;
    try { const u = new URL(a.href); if (skinnable(u)) { u.searchParams.set('useskin', 'vector'); a.href = u.href; } } catch {}
  };
  addEventListener('mousedown', carry, true); addEventListener('keydown', e => { if (e.key === 'Enter') carry(e); }, true);
  const forms = () => {
    if (!document.body?.classList.contains('skin-vector-legacy')) return;
    for (const form of document.querySelectorAll('form[action*="/w/index.php"], form#searchform')) {
      if (form.method?.toLowerCase() === 'post' || form.querySelector('input[name="useskin"]')) continue;
      const input = document.createElement('input');
      input.type = 'hidden'; input.name = 'useskin'; input.value = 'vector';
      form.append(input);
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', forms, { once: true }); else forms();
})();
(() => {
  if (!/^(en\.wiktionary|en\.wikivoyage|commons\.wikimedia)\.org$/.test(location.hostname)) return;
  const relabel = (id, text) => {
    const a = document.getElementById(id)?.querySelector('a');
    if (a) (a.querySelector('span') || a).textContent = text;
  };
  const placeAfter = (id, anchorId) => {
    const item = document.getElementById(id), anchor = document.getElementById(anchorId);
    if (item && anchor?.parentElement) anchor.after(item);
  };
  const restore = () => {
    const body = document.body;
    if (!body?.classList.contains('skin-vector-legacy') || body.hasAttribute('data-n19-sidebar')) return;
    body.setAttribute('data-n19-sidebar', '');
    placeAfter('n-specialpages', 't-upload');
    placeAfter('t-wikibase', 't-info');
    for (const nav of document.querySelectorAll('#mw-panel nav.vector-menu-portal')) if (!nav.querySelector('li')) nav.setAttribute('data-n19-empty', '');
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', restore, { once: true }); else restore();
})();
