// net19 handmade theme: Gmail, 2019. Palette tokens live in gmail.css. Gmail's light/dark is a theme choice, written as
// `.bof{content:"<theme id>"}` in one of its <style> elements; the dark themes are detected by id and restyled dark.
// Post-2019 controls are hidden by label as well as by class: Gemini and its summaries, "Help me write", reactions,
// Chat/Meet entries, package tracking and "Manage subscriptions".
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
    // Picture themes: the bar and drawer are drawn for the photo behind them and stay as drawn with it in a flipped
    // page; the search field on the bar flips with the page.
    keep: 'html[data-n19-picture] :is(header#gb, .aeN, .aqn, .wp, .wq)',
    reflip: 'html[data-n19-picture] header#gb form',
    searchLabel: 'Search mail',
    later: /^(?:ai inbox|ask gmail|ask gemini|gemini|summari[sz]e this (?:email|conversation|thread)|summary|help me write|polish|refine|formali[sz]e|elaborate|shorten|smart compose|chat|spaces|meet|new meeting|join a meeting|start a meeting|my meetings|new chat|share in chat|react(?:ion)?s?|add reaction|add emoji reaction|emoji reaction|track package|track your package|package tracking|arriving (?:today|tomorrow|soon)|out for delivery|manage subscriptions|subscriptions|purchases|google one|get more storage with google one)$/i,
    keepLabels: /^(?:inbox|starred|snoozed|sent|drafts|spam|trash|all mail|important|scheduled|categories|more|less)$/i,
  };
  // A picture theme paints its photo on .a4t; html[data-n19-picture] tells gmail.css and the keep rules above.
  const picture = () => {
    const layer = document.querySelector('.a4t');
    const on = !!layer && /url\(/.test(layer.style.backgroundImage || getComputedStyle(layer).backgroundImage);
    const label = on && document.querySelector('.aeN .TO .nU, .aqn .TO .nU, .aeN a[href$="#starred"]');
    const white = label && /^rgba?\((2[3-5]\d),\s*(2[3-5]\d),\s*(2[3-5]\d)/.test(getComputedStyle(label).color);
    const value = on ? (white ? 'white' : 'dark') : null;
    if (value === document.documentElement.getAttribute('data-n19-picture')) return;
    if (value) document.documentElement.setAttribute('data-n19-picture', value); else document.documentElement.removeAttribute('data-n19-picture');
    globalThis.net19Theme.rejudge?.();
    // The label color is read again once gmail.css has followed the new value (its own label color no longer applies).
    if (value === 'dark') requestAnimationFrame(() => requestAnimationFrame(picture));
  };
  let queued = false;
  const start = () => {
    picture();
    new MutationObserver(() => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; picture(); }); } })
      .observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
  };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
