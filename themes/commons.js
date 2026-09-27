// net19 handmade theme: Wikimedia Commons, 2019, in its own legacy Vector skin (served by Wikimedia itself). The skin had no
// dark mode, so on a dark device palette.js flips the page (pictures keep their real colors); a reader's own dark
// gadget, which paints the page dark, is left alone.
globalThis.net19Theme = {};
// The worker adds useskin=vector to plain page addresses. Pages reached with a query (full-text search results,
// history, diffs, special pages with parameters) or a #section (links from categories and search results) would
// otherwise open in the 2022 skin, so:
// - links and forms on legacy pages carry useskin=vector along, so those pages open in the legacy skin directly;
// - a 2022-skin page reached some other way asks for the same address in the legacy skin (hidden until it arrives).
(() => {
  if (location.hostname !== 'commons.wikimedia.org') return;
  const root = document.documentElement;
  const url = new URL(location.href);
  // Special:MediaSearch (2021) replaced the search results page Commons had in 2019. The header search, links and
  // direct visits go to Special:Search with the same terms instead.
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
