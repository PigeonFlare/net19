globalThis.net19Theme = { later: /^(?:romie|ask romie|get ai-powered answers.*|ask a question about this property|chat with ai|trip planner with ai|communication center|click to open vac widget.*)$/i };
(() => {
  const TAGLINE = /^the one place you go to go places\.?$/i;
  const hideTagline = () => {
    for (const heading of document.querySelectorAll(':is([data-testid="overlapped-search-form-region"], [data-testid="search-form-and-deals-banner-section"]) :is(h1, h2):not([data-net19-hidden])')) {
      if (TAGLINE.test(globalThis.net19English(heading.textContent.replace(/\s+/g, ' ').trim()))) heading.setAttribute('data-net19-hidden', '');
    }
  };
  net19.watch(hideTagline);
})();
