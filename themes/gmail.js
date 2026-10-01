(() => {
  const DARK = /^(?:basicblack|wood|graffiti|planets|terminal|customdark|darkmode|dark)$/;
  let seen = -1, cached;
  const themeId = () => {
    const styles = document.getElementsByTagName('style');
    if (styles.length === seen) return cached;
    seen = styles.length; cached = undefined;
    for (const style of styles) {
      const m = /\.bof\{content:"([a-z0-9]+)/.exec(style.textContent);
      if (m) { cached = m[1]; break; }
    }
    return cached;
  };
  globalThis.net19Theme = {
    detect() {
      const id = themeId();
      if (!id) return 'light';
      return DARK.test(id) ? 'dark' : 'light';
    },
    watch: ['class', 'style'],
    keep: 'html[data-n19-picture] :is(header#gb, .aeN, .aqn, .wp, .wq), .aoI .T-I:is(.aoO, .hG)',
    reflip: 'html[data-n19-picture] header#gb form',
    searchLabel: 'Search mail',
    later: /^(?:ai inbox|ask gmail|ask gemini|gemini|summari[sz]e this (?:email|conversation|thread)|summary|help me write|polish|refine|formali[sz]e|elaborate|shorten|chat|spaces|meet|new meeting|join a meeting|start a meeting|my meetings|new chat|share in chat|react(?:ion)?s?|add reaction|add emoji reaction|emoji reaction|track package|track your package|package tracking|arriving (?:today|tomorrow|soon)|out for delivery|manage subscriptions|subscriptions|purchases|google one|get more storage with google one|studio|workspace studio|google workspace studio|flows|new flow|create a flow|discover flows)$/i,
    keepLabels: /^(?:inbox|starred|snoozed|sent|drafts|spam|trash|all mail|important|scheduled|categories|more|less)$/i,
  };
  const picture = () => {
    const layer = document.querySelector('.a4t');
    const on = !!layer && /url\(/.test(layer.style.backgroundImage || getComputedStyle(layer).backgroundImage);
    const label = on && document.querySelector('.aeN .TO:not(.nZ) .nU, .aqn .TO:not(.nZ) .nU');
    const white = label && /^rgba?\((2[3-5]\d),\s*(2[3-5]\d),\s*(2[3-5]\d)/.test(getComputedStyle(label).color);
    const value = on ? (white ? 'white' : 'dark') : null;
    const panel = on && document.querySelector('.bkK > .nH');
    const list = panel && /^rgba?\((2[3-5]\d),\s*(2[3-5]\d),\s*(2[3-5]\d)(?:,\s*(?:0?\.[5-9]\d*|1))?\)$/.test(getComputedStyle(panel).backgroundColor) ? 'light' : null;
    const root = document.documentElement;
    if (list !== root.getAttribute('data-n19-list')) { if (list) root.setAttribute('data-n19-list', list); else root.removeAttribute('data-n19-list'); }
    if (value === root.getAttribute('data-n19-picture')) return;
    if (value) root.setAttribute('data-n19-picture', value); else root.removeAttribute('data-n19-picture');
    if (globalThis.net19Theme.rejudge) globalThis.net19Theme.rejudge(); else requestAnimationFrame(() => globalThis.net19Theme.rejudge?.());
    if (value === 'dark') requestAnimationFrame(() => requestAnimationFrame(picture));
  };
  const start = () => {
    picture();
    addEventListener('load', () => setTimeout(() => globalThis.net19Theme.rejudge?.(), 600), { once: true });
    for (const wait of [1500, 4000]) setTimeout(() => { picture(); globalThis.net19Theme.rejudge?.(); }, wait);
    new MutationObserver(net19.frame(picture))
      .observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
  };
  net19.onBody(start);
})();
(() => {
  const TABS = /^(?:discover|flows|activity)$/i;
  const text = el => (el.textContent || '').replace(/\s+/g, ' ').trim();
  const relabel = () => {
    for (const field of document.querySelectorAll('header#gb form input[name="q"][aria-label]')) if (/^ask\b/i.test(field.getAttribute('aria-label'))) field.setAttribute('aria-label', 'Search mail');
  };
  const panel = () => {
    relabel();
    for (const heading of document.querySelectorAll('[role="complementary"] [role="heading"], [role="complementary"] h1, [role="complementary"] h2, .brC-brG [role="heading"], .brC-brG h1, .brC-brG h2')) {
      if (!/^(?:google workspace )?studio$/i.test(text(heading))) continue;
      const side = heading.closest('.brC-brG, [role="complementary"]');
      if (!side || side.hasAttribute('data-net19-studio')) continue;
      const tabs = [...side.querySelectorAll('[role="tab"], button, [role="button"]')].filter(t => TABS.test(text(t)));
      if (tabs.length >= 2) side.setAttribute('data-net19-studio', '');
    }
  };
  net19.watch(panel);
})();
