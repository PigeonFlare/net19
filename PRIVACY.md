# net19 privacy policy

Effective September 29, 2026. Applies to net19 0.20.0.

Net19 restyles 167 popular websites to look as they did in 2019. It has no developer-operated server, account system, analytics, advertisements, remote AI, or telemetry.

## What leaves your device

Nothing about you. Net19 has no server and sends nothing anywhere. Its themes are stylesheets and small scripts bundled inside the extension. Some themes show a site's own older logos, icons or fonts, such as Google, Bing and Wikipedia's logos, the Twitter bird from abs.twimg.com, Reddit's 2019 fonts and snoo from redditstatic.com, and Medium's 2019 fonts from glyph.medium.com, DuckDuckGo's 2019 logos and Proxima Nova font from duckduckgo.com, and Roblox's 2016 wordmark from its image host images.rbxcdn.com. Your browser loads these from that same site's own servers, like any other part of the page, except for a few sites' 2019 web fonts, which load from a font service or file host: Google Fonts (fonts.gstatic.com) for Substack, FreeFunder and FundRazr, Adobe Fonts (use.typekit.net) for Indiegogo and Patreon, and a CloudFront host (d207bzo2lz83l1.cloudfront.net) for Kickstarter. Like any web font request, these send your IP address and browser details, and no page content or account information. To keep text readable on a site's own flat or gradient panel images, net19 may draw such an image from the same site (normally already in your browser's cache) into a small local canvas to read its average color; the result stays on your device.

Some themes use a site's own settings:

- Wikipedia, Wiktionary, Wikivoyage, Wikimedia Commons, Miraheze and Bulbapedia article links get a `useskin` parameter, which selects the site's own legacy skin.
- Signed in to Reddit, opening the feed menu asks reddit.com itself for the list of communities you subscribe to, the same list Reddit's own sidebar shows, so the menu can show them as it did in 2019.
- On a Reddit community page, net19 asks reddit.com for that community's public details (member count and description) to show its 2019 COMMUNITY DETAILS box. Both answers stay in the open page (the community details are kept for that browser tab only). The list stays in the open page.
- Reddit feeds open in Reddit's own views: Classic on the home, Popular and All feeds, and Card on communities. net19 sets Reddit's `compact` preference cookie, the same one Reddit's own View menu sets, plus an `n19view` cookie on reddit.com that records that it has done so. Choosing another view in that menu keeps your choice. Like any Reddit cookie, they stay in your browser and are sent only to Reddit.

## Access and storage

Net19 has access only to the 167 sites it themes (161 domains, listed in `src/themes.ts`). It does not run on any other site and cannot read them.

Chrome local extension storage holds your settings: whether net19 is on, and which sites you switched off. When a themed site's redesign stops a theme from fitting, it also holds that site section's name (for example `youtube.com/watch`) until the theme fits again, so later visits start on the theme's safe layer. Updating from an earlier version deletes the archive profiles and other data those versions kept.

## Controls

Switch net19 off in the popup, or off for the current site. Either change restores the site's current styling from the next page load. Uninstalling removes the extension's storage.

Report questions through [the repository](https://github.com/PigeonFlare/net19/issues). Avoid posting private addresses, credentials, or personal page contents in public issues.
