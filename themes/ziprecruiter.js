globalThis.net19Theme = {
  later: /^(Who is Phil\??|Trust and Safety|New Account Help|Resume Database|Customer Stories|FAQs|Request a Consultation|Investors|Engineering|Follow ZipRecruiter on Instagram|Read more about Ziprecruiter Security and Compliance|Security and Compliance)$/i,
  intended: '[data-n19-post], #main-content + div',
};
(() => {
  const LATER_SECTIONS = /^(Be Seen First - how it works|Make your application impossible to miss|Ready to be seen first\?)$/i;
  const hide = el => { if (el && !el.hasAttribute('data-n19-post')) el.setAttribute('data-n19-post', ''); };
  const fix = () => {
    const blocks = document.querySelector('#main-content + div + div');
    if (!blocks) return;
    for (const block of blocks.children) {
      const heading = block.querySelector('h1, h2, h3, p');
      if (heading && LATER_SECTIONS.test(heading.textContent.trim())) hide(block);
    }
  };
  net19.watch(fix);
})();
