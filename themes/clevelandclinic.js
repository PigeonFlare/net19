globalThis.net19Theme = {
  intended: '[data-n19-later]',
  later: /^(?:medical professionals|closures & updates|let.s chat!?|show services|sign up today|advertising policy|social media policy|100 years of cleveland clinic|virtual second opinions|virtual visits|myclevelandclinic|appointments & locations|request an appointment)$/i,
};
(() => {
  const words = { 'Find a Provider': 'Find a Doctor', 'Locations and Directions': 'Locations & Directions', 'Patients and Visitors': 'Patients & Visitors', Services: 'Institutes & Departments', 'Donate Now': 'Giving', 'Give to Cleveland Clinic': 'Make a Donation' };
  const text = el => el.textContent.replace(/\s+/g, ' ').trim();
  const mark = el => { if (el && !el.hasAttribute('data-n19-later')) el.setAttribute('data-n19-later', ''); };
  const fix = () => {
    for (const link of document.querySelectorAll('header ul li > :is(a, button), header section a, footer a')) {
      net19.rename(link, words);
    }
    for (const label of document.querySelectorAll('header section div.font-bold')) if (text(label) === 'Locations:') mark(label.closest('section'));
    for (const el of document.querySelectorAll('header > div')) if (text(el) === 'Closures & Updates') mark(el);
    for (const el of document.querySelectorAll('p, span')) {
      if (text(el) !== 'Advertisement' || el.children.length) continue;
      const box = el.parentElement?.parentElement;
      if (box && box.querySelectorAll('a[href], h2, h3').length <= 2) mark(box);
    }
    for (const h of document.querySelectorAll('h2, h3')) {
      const t = text(h);
      if (t === 'Subscribe to Cleveland Clinic Health Essentials') mark(h.parentElement);
      if (t === 'Better health starts here') mark(h.closest('div.border-y') || h.parentElement);
    }
    for (const a of document.querySelectorAll('div.bg-brandBlue-500 a')) if (/^(Find a (?:Provider|Doctor)|Locations|Appointments)\S/.test(text(a))) mark(a.parentElement.childElementCount === 1 ? a.parentElement : a);
    for (const a of document.querySelectorAll('div.bg-brandBlue-500 a')) if (text(a) === 'Pay Your Bill Online') for (const n of a.childNodes) if (n.nodeType === 3 && n.textContent.includes('Pay Your Bill Online')) n.textContent = n.textContent.replace('Pay Your Bill Online', 'Pay Your Bill');
    for (const el of document.querySelectorAll('span.font-bold')) if (text(el) === 'Medically Reviewed.') mark(el.closest('section'));
    for (const el of document.querySelectorAll('p, div')) if (/^Cleveland Clinic is a non-profit academic medical center\. Advertising/.test(text(el)) && el.children.length <= 1) mark(el);
  };
  const later = net19.watch(fix);
})();
