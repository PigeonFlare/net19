globalThis.net19Theme = {};
(() => {
  if (location.hostname !== 'commons.wikimedia.org') return;
  const root = document.documentElement;
  const url = new URL(location.href);
  const MEDIA = /^\/wiki\/Special:MediaSearch\/?$/i;
  const media = u => u.origin === location.origin && (MEDIA.test(decodeURIComponent(u.pathname)) || /^Special:MediaSearch$/i.test(u.searchParams.get('title') || ''));
  const classic = u => {
    const out = new URL('/w/index.php', location.origin);
    out.searchParams.set('title', 'Special:Search');
    const terms = u.searchParams.get('search') || u.searchParams.get('q') || '';
    if (terms) { out.searchParams.set('search', terms); out.searchParams.set('fulltext', '1'); }
    out.searchParams.set('useskin', 'vector');
    return out;
  };
  if (media(url)) { root.setAttribute('data-net19-reskin', ''); location.replace(classic(url).href); return; }
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
    try { const u = new URL(a.href); if (media(u)) { a.href = classic(u).href; return; } if (skinnable(u)) { u.searchParams.set('useskin', 'vector'); a.href = u.href; } } catch {}
  };
  addEventListener('mousedown', carry, true); addEventListener('keydown', e => { if (e.key === 'Enter') carry(e); }, true);
  const forms = () => {
    if (!document.body?.classList.contains('skin-vector-legacy')) return;
    for (const form of document.querySelectorAll('form[action*="/w/index.php"], form#searchform')) {
      const title = form.querySelector('input[name="title"]');
      if (title && /^Special:MediaSearch$/i.test(title.value)) title.value = 'Special:Search';
      if (form.method?.toLowerCase() === 'post' || form.querySelector('input[name="useskin"]')) continue;
      const input = document.createElement('input');
      input.type = 'hidden'; input.name = 'useskin'; input.value = 'vector';
      form.append(input);
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', forms, { once: true }); else forms();
})();
