// net19 handmade theme: Miraheze, 2019. In 2019 every Miraheze wiki that had not picked another skin, Meta included,
// wore MediaWiki's Vector skin, which the farm still serves as "Vector legacy" (useskin=vector). Vector 2022 did not
// exist then, so a page that arrives in it is asked for again in the legacy skin before it paints; wikis whose owners
// chose another skin (MonoBook, Timeless, Cosmos, Citizen...) are left as their owners set them.
// The skin had no dark mode, so on a dark device palette.js flips the page. A reader's own DarkMode setting
// (html.client-darkmode, an inverting filter) already shows the page dark and is left alone.
globalThis.net19Theme = {
  detect: () => document.documentElement.classList.contains('client-darkmode') ? 'dark' : undefined,
};
(() => {
  if (!/(^|\.)miraheze\.org$/.test(location.hostname)) return;
  const root = document.documentElement;
  const wiki = u => u.origin === location.origin && (u.pathname.startsWith('/w/index.php') || u.pathname.startsWith('/wiki/'));
  const skinnable = u => wiki(u) && !u.searchParams.has('useskin') &&
    !/^(edit|submit|raw|render)$/.test(u.searchParams.get('action') || '') && !u.searchParams.has('veaction');
  const url = new URL(location.href);
  // The body's classes name the skin as soon as <body> is parsed, before anything is painted.
  const decide = body => {
    if (body.classList.contains('skin-vector-2022') && skinnable(url)) {
      root.setAttribute('data-net19-reskin', '');
      url.searchParams.set('useskin', 'vector');
      location.replace(url.href);
      setTimeout(() => root.removeAttribute('data-net19-reskin'), 4000);
    }
  };
  if (document.body) decide(document.body);
  else {
    const watch = new MutationObserver(() => { if (document.body) { watch.disconnect(); decide(document.body); } });
    watch.observe(root, { childList: true });
  }
  // On a page net19 moved to the legacy skin, links and forms carry useskin=vector along, so the next page opens in it
  // directly. Wikis that are in legacy Vector (or another skin) by their own choice are not touched.
  if (url.searchParams.get('useskin') !== 'vector') return;
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
