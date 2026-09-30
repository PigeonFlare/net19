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
  flat: '.kix-appview-editor canvas, .kix-cursor-caret',
  keep: '#docs-titlebar-share-client-button',
  later: /^(?:upgrade|studio|workspace studio|google workspace studio|ask gemini\b.*|gemini in (?:drive|docs|sheets|slides)|help me (?:create|organi[sz]e|visuali[sz]e|analy[sz]e)|summari[sz]e (?:this )?(?:file|folder|document|doc|presentation|spreadsheet)|ask about (?:this )?(?:file|folder|document)|catch me up|beautify this (?:slide|image)|generate (?:an )?(?:image|video|audio|table)|create (?:a )?(?:video|audio overview)|listen to (?:this )?doc|audio overview|building blocks|smart chips|meet|present (?:tab )?to (?:a )?(?:call|meeting)|join (?:a )?call(?: here)?|try gemini|get gemini|google one ai premium|google ai (?:pro|ultra)|workspace labs|emoji reactions?|react(?:ion)?s?|add (?:emoji )?reaction|security limitations|add shortcut to drive.*)$/i,
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
    if (net19.lang() === 'en') for (const field of document.querySelectorAll('#gb input[name="q"]:is([placeholder="Search in Drive"], [placeholder="Get answers from Drive"])')) { field.placeholder = 'Search Drive'; field.setAttribute('aria-label', 'Search Drive'); }
    for (const svg of document.querySelectorAll('#gb button[data-rp-placement-id="OneGoogleBarSearchButton"] svg:not([data-net19-lens])')) {
      const [path, ...rest] = svg.querySelectorAll('path');
      if (!path) continue;
      svg.setAttribute('data-net19-lens', '');
      svg.setAttribute('viewBox', '0 0 24 24');
      for (const other of rest) other.remove();
      path.setAttribute('d', 'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z');
    }
  };
  let queued = false;
  const start = () => { run(); new MutationObserver(() => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; run(); }); } }).observe(document.documentElement, { childList: true, subtree: true }); };
  net19.onBody(start);
})();
(() => {
  if (location.hostname !== 'docs.google.com') return;
  const run = () => {
    const menu = document.getElementById('docs-extensions-menu');
    if (menu && menu.textContent.trim() === 'Extensions') for (const node of menu.childNodes) if (node.nodeType === 3 && node.nodeValue.trim() === 'Extensions') node.nodeValue = 'Add-ons';
  };
  let queued = false;
  const start = () => { run(); new MutationObserver(() => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; run(); }); } }).observe(document.documentElement, { childList: true, subtree: true }); };
  net19.onBody(start);
})();
