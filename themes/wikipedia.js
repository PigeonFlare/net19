globalThis.net19Theme = {
  detect: () => matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
};
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
(() => {
  if (!/^en\.wikipedia\.org$/.test(location.hostname)) return;
  const relabel = (id, text, title) => {
    const a = document.querySelector(`#${id} > a`);
    if (!a) return null;
    const span = a.querySelector('span') || a;
    span.textContent = text;
    if (title) a.title = title;
    return a.parentElement;
  };
  const placeAfter = (item, anchorId) => {
    const anchor = document.getElementById(anchorId);
    if (item && anchor && anchor.parentElement) anchor.after(item);
  };
  const restore = () => {
    const body = document.body;
    if (!body?.classList.contains('skin-vector-legacy') || body.hasAttribute('data-n19-sidebar')) return;
    body.setAttribute('data-n19-sidebar', '');
    const nav = document.querySelector('#p-navigation ul');
    const contents = document.getElementById('n-contents');
    if (nav && contents && !document.getElementById('n-featuredcontent')) {
      const featured = contents.cloneNode(true);
      featured.id = 'n-featuredcontent';
      const a = featured.querySelector('a');
      a.href = '/wiki/Portal:Featured_content';
      a.title = 'Featured content – the best of Wikipedia';
      a.removeAttribute('accesskey');
      (a.querySelector('span') || a).textContent = 'Featured content';
      contents.after(featured);
    }
    relabel('n-sitesupport', 'Donate to Wikipedia', 'Support us');
    const heading = document.querySelector('#p-interaction-label .vector-menu-heading-label') || document.getElementById('p-interaction-label');
    if (heading) heading.textContent = 'Interaction';
    const help = document.getElementById('n-help');
    const about = relabel('n-aboutsite', 'About Wikipedia', 'Find out about Wikipedia');
    if (help && about) help.after(about);
    relabel('n-portal', 'Community portal', 'About the project, what you can do, where to find things');
    const contact = relabel('n-contactpage', 'Contact page', 'How to contact Wikipedia');
    placeAfter(contact, 'n-recentchanges');
    const special = document.getElementById('n-specialpages');
    placeAfter(special, 't-upload');
    const wikidata = document.getElementById('t-wikibase');
    const other = wikidata?.closest('nav');
    placeAfter(wikidata, 't-info');
    if (other && !other.querySelector('li')) other.setAttribute('data-n19-empty', '');
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', restore, { once: true }); else restore();
})();
(() => {
  if (!/\.wikipedia\.org$/.test(location.hostname)) return;
  const root = document.documentElement;
  const dark = matchMedia('(prefers-color-scheme: dark)');
  const sync = () => {
    const want = dark.matches;
    if (root.classList.contains('skin-theme-clientpref-night') !== want) root.classList.toggle('skin-theme-clientpref-night', want);
  };
  sync();
  dark.addEventListener('change', sync);
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['class'] });
})();
