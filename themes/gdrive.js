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
  flat: '.kix-appview-editor canvas',
  later: /^(?:upgrade|ask gemini\b.*|gemini in (?:drive|docs|sheets|slides)|help me (?:create|organi[sz]e|visuali[sz]e|analy[sz]e)|summari[sz]e (?:this )?(?:file|folder|document|doc|presentation|spreadsheet)|ask about (?:this )?(?:file|folder|document)|catch me up|beautify this (?:slide|image)|generate (?:an )?(?:image|video|audio|table)|create (?:a )?(?:video|audio overview)|listen to (?:this )?doc|audio overview|building blocks|smart chips|meet|present (?:tab )?to (?:a )?(?:call|meeting)|join (?:a )?call(?: here)?|try gemini|get gemini|google one ai premium|google ai (?:pro|ultra)|workspace labs|emoji reactions?|react(?:ion)?s?|add (?:emoji )?reaction)$/i,
  keepLabels: /^(?:meeting notes|meetings)$/i,
};
})();
if (location.hostname === 'docs.google.com') addEventListener('load', () => setTimeout(() => dispatchEvent(new Event('resize')), 800), { once: true });
(() => {
  if (location.hostname !== 'drive.google.com') return;
  const LATER = /^(?:home|projects|spam|activity|workspaces)$/i;
  const text = el => (el.textContent || '').replace(/\s+/g, ' ').trim();
  const run = () => {
    for (const item of document.querySelectorAll('[role="navigation"] [role="treeitem"], [role="tree"] > [role="treeitem"]')) {
      if (item.hasAttribute('data-net19-drive-later')) continue;
      const label = document.getElementById((item.getAttribute('aria-labelledby') || '').split(' ')[0]);
      if (label && LATER.test(text(label))) item.setAttribute('data-net19-drive-later', '');
    }
    for (const field of document.querySelectorAll('#gb input[name="q"][placeholder="Search in Drive"]')) { field.placeholder = 'Search Drive'; field.setAttribute('aria-label', 'Search Drive'); }
  };
  let queued = false;
  const start = () => { run(); new MutationObserver(() => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; run(); }); } }).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else new MutationObserver((_, o) => { if (document.body) { o.disconnect(); start(); } }).observe(document.documentElement, { childList: true });
})();
(() => {
  if (location.hostname !== 'docs.google.com') return;
  const run = () => {
    const menu = document.getElementById('docs-extensions-menu');
    if (menu && menu.textContent.trim() === 'Extensions') for (const node of menu.childNodes) if (node.nodeType === 3 && node.nodeValue.trim() === 'Extensions') node.nodeValue = 'Add-ons';
  };
  let queued = false;
  const start = () => { run(); new MutationObserver(() => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; run(); }); } }).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else new MutationObserver((_, o) => { if (document.body) { o.disconnect(); start(); } }).observe(document.documentElement, { childList: true });
})();
