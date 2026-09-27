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
