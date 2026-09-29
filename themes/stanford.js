globalThis.net19Theme = {
  intended: '[data-n19-post2019], footer li:has(> a:is([href*="linkedin.com"], [href*="news.stanford.edu/subscribe"], [href*="podcasts.apple.com"], [href="https://alumni.stanford.edu"], [href*="openfacultypositions"], [href*="careered.stanford.edu"], [href*="sustainability.stanford.edu"], [href="/athletics"]))',
};
(() => {
  const order2019 = ['Academics', 'Research', 'Health & Medicine', 'Life on the Farm', 'Admissions & Aid', 'About'];
  const addAudienceLinks = () => {
    const bar = document.querySelector('header .bg-bg-knockout-brand-strong > nav');
    const source = document.querySelector('nav[data-testid="audience-nav"] ul');
    if (!bar || !source || bar.querySelector('.n19-audience')) return;
    const list = document.createElement('ul');
    list.className = 'n19-audience';
    list.setAttribute('aria-label', 'Information for');
    for (const link of source.querySelectorAll('a')) {
      const item = document.createElement('li');
      const copy = document.createElement('a');
      copy.href = link.href;
      copy.textContent = link.textContent.trim();
      item.append(copy);
      list.append(item);
    }
    const slot = [...bar.children].find(child => child.querySelector('form'));
    if (slot) slot.before(list); else bar.append(list);
  };
  const pass = () => {
    addAudienceLinks();
    for (const button of document.querySelectorAll('nav[data-testid="main-nav"] > ul > li > button')) {
      const label = button.textContent.trim();
      const item = button.parentElement;
      if (label === 'Athletics') item.setAttribute('data-n19-post2019', '');
      const rank = order2019.indexOf(label);
      if (rank >= 0) item.style.setProperty('order', String(rank), 'important');
    }
  };
  const timed = () => {
    for (const ms of [0, 400, 1500, 4000]) setTimeout(pass, ms);
    let queued = false;
    new MutationObserver(() => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; pass(); }); }).observe(document.documentElement, { childList: true, subtree: true });
  };
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', timed, { once: true }); else timed();
})();
