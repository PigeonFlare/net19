# net19 privacy policy

Effective September 26, 2026. Applies to net19 0.10.0.

Net19 restyles 150 popular websites to look as they did in 2019. It has no developer-operated server, account system, analytics, advertisements, remote AI, or telemetry.

## What leaves your device

Nothing about you. Net19 has no server and sends nothing anywhere. Its themes are stylesheets and small scripts bundled inside the extension. Some themes show a site's own older logos, icons or fonts, such as Google, Bing and Wikipedia's logos, the Twitter bird from abs.twimg.com, and Reddit's 2019 fonts and snoo from redditstatic.com. Your browser loads these from that same site's own servers, like any other part of the page. To keep text readable on a site's own flat or gradient panel images, net19 may draw such an image from the same site (normally already in your browser's cache) into a small local canvas to read its average color; the result stays on your device.

Two themes use a site's own settings:

- Wikipedia article links get `useskin=vector`, Wikipedia's own legacy skin.
- Signed in to Reddit, opening the feed menu asks reddit.com itself for the list of communities you subscribe to, the same list Reddit's own sidebar shows, so the menu can show them as it did in 2019. The list stays in the open page.
- Reddit feeds open in Reddit's own Classic view: signed out, net19 sets Reddit's `compact=true` preference cookie, the same one Reddit's own View menu sets. Choosing another view in that menu keeps your choice.

## Access and storage

Net19 has access only to the 150 sites it themes (listed in `src/themes.ts`). It does not run on any other site and cannot read them.

Chrome local extension storage holds your settings: whether net19 is on, and which sites you switched off. When a themed site's redesign stops a theme from fitting, it also holds that site section's name (for example `youtube.com/watch`) until the theme fits again, so later visits start on the theme's safe layer. Updating from an earlier version deletes the archive profiles and other data those versions kept.

## Controls

Switch net19 off in the popup, or off for the current site. Either change restores the site's current styling from the next page load. Uninstalling removes the extension's storage.

Report questions through [the repository](https://github.com/henry-xli/net19/issues). Avoid posting private addresses, credentials, or personal page contents in public issues.
