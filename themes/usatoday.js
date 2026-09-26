// net19 handmade theme: usatoday. The site has one light design, so palette.js reads it from the page background and
// inverts it on dark devices. Follow-a-topic buttons, the Google preferred-source tile and app promos are post-2019
// and are also caught by label.
globalThis.net19Theme = {
  later: /^(?:add topic|follow topic|find us on google|get the usa today app|listen to (?:this )?(?:article|story))$/i,
};
