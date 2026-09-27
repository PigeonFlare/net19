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
    keep: 'html[data-n19-picture] :is(header#gb, .aeN, .aqn, .wp, .wq)',
    reflip: 'html[data-n19-picture] header#gb form',
    searchLabel: 'Search mail',
    later: /^(?:ai inbox|ask gmail|ask gemini|gemini|summari[sz]e this (?:email|conversation|thread)|summary|help me write|polish|refine|formali[sz]e|elaborate|shorten|smart compose|chat|spaces|meet|new meeting|join a meeting|start a meeting|my meetings|new chat|share in chat|react(?:ion)?s?|add reaction|add emoji reaction|emoji reaction|track package|track your package|package tracking|arriving (?:today|tomorrow|soon)|out for delivery|manage subscriptions|subscriptions|purchases|google one|get more storage with google one)$/i,
    keepLabels: /^(?:inbox|starred|snoozed|sent|drafts|spam|trash|all mail|important|scheduled|categories|more|less)$/i,
  };
  const picture = () => {
    const layer = document.querySelector('.a4t');
    const on = !!layer && /url\(/.test(layer.style.backgroundImage || getComputedStyle(layer).backgroundImage);
    const label = on && document.querySelector('.aeN .TO:not(.nZ) .nU, .aqn .TO:not(.nZ) .nU');
    const white = label && /^rgba?\((2[3-5]\d),\s*(2[3-5]\d),\s*(2[3-5]\d)/.test(getComputedStyle(label).color);
    const value = on ? (white ? 'white' : 'dark') : null;
    if (value === document.documentElement.getAttribute('data-n19-picture')) return;
    if (value) document.documentElement.setAttribute('data-n19-picture', value); else document.documentElement.removeAttribute('data-n19-picture');
    if (globalThis.net19Theme.rejudge) globalThis.net19Theme.rejudge(); else requestAnimationFrame(() => globalThis.net19Theme.rejudge?.());
    if (value === 'dark') requestAnimationFrame(() => requestAnimationFrame(picture));
  };
  let queued = false;
  const start = () => {
    picture();
    addEventListener('load', () => setTimeout(() => globalThis.net19Theme.rejudge?.(), 600), { once: true });
    for (const wait of [1500, 4000]) setTimeout(() => { picture(); globalThis.net19Theme.rejudge?.(); }, wait);
    new MutationObserver(() => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; picture(); }); } })
      .observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
  };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
