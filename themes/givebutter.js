globalThis.net19Theme = {
  detect: () => 'light',
  intended: '.intercom-lightweight-app, #intercom-container, html[data-wf-site] :is(.section_compare2-results, .section_home2-help, .section_home2-unlock), html[data-wf-site] .footer-v2 form',
  later: /^(?:see all comparisons|switch to givebutter|stripe payments company|stripe verified partner badge.?|givebutter wallet|wallet|earn rewards on every donation|givebutter plus|the spread|ask ai|ai writer|write with ai|generate with ai)$/i,
};
(() => {
  const navLabels = new Map([['Log in', 'Sign in'], ['Sign up for free', 'Sign up']]);
  const relabel = () => {
    for (const button of document.querySelectorAll('.navbar_v2 :is(.navbar_button2, .navbar_button, .navbar_button_secondary2, .navbar_button_secondary)')) {
      for (const node of button.childNodes) {
        if (node.nodeType !== 3) continue;
        const renamed = navLabels.get(node.nodeValue.trim());
        if (renamed) node.nodeValue = renamed;
      }
    }
  };
  net19.watch(relabel);
})();
