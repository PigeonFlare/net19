// net19 handmade theme: Google Drive and the Docs editors, 2019 (Material 2). Palette tokens live in gdrive.css.
// Drive keeps its own light/dark setting; it is read from a Drive token the theme leaves untouched (the yellow file-type
// color, #fbbc04 light and #ffe082 dark). The editors mark their dark setting with a docsDarkMode class.
// Post-2019 controls are hidden by label: Gemini, "Help me create", summaries, Meet, and the 2021 smart-canvas entries.
// Slides' viewers (preview, present, embed, published) are black stages in every era: they are never flipped.
(() => {
const viewer = () => /^\/presentation\/(?:u\/\d+\/)?d\/[^/]+\/(?:preview|present|embed|pub)|^\/presentation\/d\/e\//.test(location.pathname);
globalThis.net19Theme = {
  only: () => (viewer() ? 'dark' : undefined),
  detect() {
    if (viewer()) return 'dark';
    const root = document.documentElement, body = document.body;
    const has = name => root.classList.contains(name) || !!body?.classList.contains(name);
    if (has('docsDarkMode')) return 'dark';
    if (has('docsSystemMode')) return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    if (has('docs-gm')) return 'light';
    const probe = body && getComputedStyle(body).getPropertyValue('--dt-mime-type-yellow').trim().toLowerCase();
    if (probe === '#ffe082') return 'dark';
    if (probe) return 'light';
    return location.hostname === 'docs.google.com' ? 'light' : undefined;
  },
  watch: ['class', 'style'],
  later: /^(?:ask gemini|gemini in (?:drive|docs|sheets|slides)|help me (?:create|organi[sz]e|visuali[sz]e|analy[sz]e)|summari[sz]e (?:this )?(?:file|folder|document|doc|presentation|spreadsheet)|ask about (?:this )?(?:file|folder|document)|catch me up|beautify this (?:slide|image)|generate (?:an )?(?:image|video|audio|table)|create (?:a )?(?:video|audio overview)|listen to (?:this )?doc|audio overview|building blocks|smart chips|meet|present (?:tab )?to (?:a )?(?:call|meeting)|join (?:a )?call(?: here)?|try gemini|get gemini|google one ai premium|google ai (?:pro|ultra)|workspace labs|emoji reactions?|react(?:ion)?s?|add (?:emoji )?reaction)$/i,
  keepLabels: /^(?:meeting notes|meetings)$/i,
};
})();
