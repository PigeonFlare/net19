// net19 handmade theme: nbcnews. The site has one light design, so palette.js reads it from the page background and
// inverts it on dark devices. The audio player, the Google preferred-source link and the Tipline are post-2019 and are
// also caught by label here.
globalThis.net19Theme = {
  later: /^(?:add(?: nbc news)? to google|tipline|nbc news tipline|listen(?: to (?:this )?(?:article|story))?|audio play)$/i,
};
