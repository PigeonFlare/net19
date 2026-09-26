// net19 handmade theme: Wikipedia's legacy Vector skin (served by Wikipedia itself). The skin predates night mode,
// so the dark variant follows the device setting.
globalThis.net19Theme = {
  detect: () => matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
};
// The worker adds useskin=vector to plain article addresses. Pages reached with a query (full-text search results,
// page history, diffs, special pages with parameters) would otherwise open in the 2022 skin, so:
// - links and forms on legacy pages carry useskin=vector along, so those pages open in the legacy skin directly;
// - a 2022-skin page reached some other way asks for the same address in the legacy skin (hidden until it arrives).
(() => {
  if (!/\.wikipedia\.org$/.test(location.hostname) || /^(www\.)?wikipedia\.org$/.test(location.hostname)) return;
  const root = document.documentElement;
  const url = new URL(location.href);
  const skinnable = u => u.origin === location.origin && u.pathname.startsWith('/w/index.php') && !u.searchParams.has('useskin') &&
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
