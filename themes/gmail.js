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
    later: /^(?:ask gemini|gemini|summari[sz]e this (?:email|conversation|thread)|summary|help me write|polish|refine|formali[sz]e|elaborate|shorten|smart compose|chat|spaces|meet|new meeting|join a meeting|start a meeting|my meetings|new chat|share in chat|react(?:ion)?s?|add reaction|add emoji reaction|emoji reaction|track package|track your package|package tracking|arriving (?:today|tomorrow|soon)|out for delivery|manage subscriptions|subscriptions|purchases|google one|get more storage with google one)$/i,
    keepLabels: /^(?:inbox|starred|snoozed|sent|drafts|spam|trash|all mail|important|scheduled|categories|more|less)$/i,
  };
})();
