globalThis.net19Theme = {
  later: /^(?:try chatgpt|download chatgpt|start now on chatgpt|ask chatgpt|log in|open search)$/i,
  intended: '[data-n19-later]',
};
(() => {
  const root = document.documentElement;
  const LATER_SECTIONS = /^(Stories|OpenAI for business|Get started with ChatGPT|Customer stories)$/i;
  const FOOTER_KEEP = /^\/(about|charter|careers|news|research(\/index)?|policies\/[a-z-]+)\/?$|x\.com\/OpenAI/i;
  const mark = el => { if (el && !el.hasAttribute('data-n19-later')) el.setAttribute('data-n19-later', ''); };
  const setLabel = (link, text) => {
    const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) if (node.data.trim()) { node.data = text; return; }
  };
  const header2019 = () => {
    const nav = document.querySelector('header nav ul');
    if (!nav || nav.hasAttribute('data-n19-nav')) return;
    const items = [...nav.querySelectorAll(':scope > li')];
    const research = items.find(li => li.querySelector('a[href^="/research"]'));
    const company = items.find(li => li.querySelector('a[href="/about/"]'));
    if (!research || !company) return;
    nav.setAttribute('data-n19-nav', '');
    for (const li of items) if (li !== research && li !== company) mark(li);
    for (const toggle of nav.querySelectorAll('li > button')) mark(toggle);
    setLabel(research.querySelector('a'), 'Progress');
    setLabel(company.querySelector('a'), 'About');
    const blog = company.cloneNode(true);
    const link = blog.querySelector('a');
    link.href = '/news/';
    setLabel(link, 'Blog');
    for (const button of blog.querySelectorAll('button')) button.remove();
    blog.removeAttribute('data-n19-later');
    nav.prepend(company);
    company.after(research);
    research.after(blog);
  };
  const footer2019 = () => {
    for (const li of document.querySelectorAll('footer li:not([data-n19-seen])')) {
      li.setAttribute('data-n19-seen', '');
      const href = li.querySelector('a')?.getAttribute('href') || '';
      if (!FOOTER_KEEP.test(href.replace(/^https:\/\/openai\.com/, ''))) mark(li);
    }
    for (const list of document.querySelectorAll('footer ul')) if (list.children.length && [...list.children].every(li => li.hasAttribute('data-n19-later'))) mark(list.parentElement);
    for (const link of document.querySelectorAll('footer a[href^="http"]')) if (!/x\.com\/OpenAI/i.test(link.href) && link.closest('div.justify-between, div.gap-6') && !link.closest('ul')) mark(link);
    for (const button of document.querySelectorAll('footer button[id^="radix-"]')) mark(button.parentElement);
  };
  const fix = () => {
    const home = location.pathname === '/' || /^\/[a-z]{2}(-[A-Z]{2})?\/?$/.test(location.pathname);
    root.toggleAttribute('data-net19-home', home);
    header2019();
    footer2019();
    for (const heading of document.querySelectorAll('main :is(h2, h3)')) if (LATER_SECTIONS.test(heading.textContent.trim())) mark(heading.closest('main#main > article > div') || heading.closest('section') || heading.parentElement?.parentElement);
    for (const link of document.querySelectorAll('main a[href*="chatgpt.com"], header a[href*="chatgpt.com"]')) mark(link);
    if (!home) return;
    const article = document.querySelector('main#main > article');
    if (!article) return;
    const first = article.firstElementChild;
    if (first && first.querySelector('textarea') && !first.hasAttribute('data-net19-hidden')) first.setAttribute('data-net19-hidden', '');
    const cover = first?.hasAttribute('data-net19-hidden') ? first.nextElementSibling : null;
    if (cover && !cover.hasAttribute('data-net19-cover')) cover.setAttribute('data-net19-cover', '');
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
