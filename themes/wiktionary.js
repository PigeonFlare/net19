// net19 handmade theme: Wiktionary, 2019, in its own legacy Vector skin (served by Wikimedia itself). The skin had no
// dark mode, so on a dark device palette.js flips the page (pictures keep their real colors); a reader's own dark
// gadget, which paints the page dark, is left alone.
globalThis.net19Theme = {};
// The worker adds useskin=vector to plain entry addresses. Pages reached with a query (full-text search results,
// history, diffs, special pages with parameters) or a #section (links from categories and search results) would
// otherwise open in the 2022 skin, so:
// - links and forms on legacy pages carry useskin=vector along, so those pages open in the legacy skin directly;
// - a 2022-skin page reached some other way asks for the same address in the legacy skin (hidden until it arrives).
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
