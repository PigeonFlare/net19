# Validation

## Automated (`npm run check`)

Typecheck, unit tests, production build, then Chromium tests that load the built extension against local fixtures (any outside request fails the test).

Unit tests cover the settings shape, host permissions matching the themed domains, per-site pause, the Wikipedia and Reddit URL rules, and the stylesheet contract: no generated text, no script-computed layout, no `html, body` backgrounds, dark tokens wherever light ones exist, and themes never switching a site's own mode.

Browser tests check that:

- themed sites get their theme and other sites get nothing;
- Wikipedia gets `useskin=vector`;
- Reddit redirects to old.reddit.com only while `reddit_session` exists, keeping path and query, and never for settings pages or share links;
- a light site on a dark device flips, with photos keeping their colors;
- the popup switches remove themes and rules as expected.

## Live audits

Run these for every theme you change, in both `SCHEME=light` and `SCHEME=dark`:

| Command | What it does |
| --- | --- |
| `npm run audit -- <id>` | Hovers menus, opens one, types into search; flags faint text, post-2019 labels, misaligned header items, buttons inside fields |
| `npm run audit:diff -- <id>` | Runs the page checks with and without net19 and reports only what net19 introduced, including CONTENT LOST |
| `npm run audit:nav -- <id>` | Follows header, menu, launcher and footer links; reports unstyled destinations |

`scripts/audit/page-checks.js` runs inside the page and reports `covered`, `offcenter`, `textoffcenter`, `overlap` and `lowcontrast` (contrast measured as actually shown, after the dark-mode flip). Also use it on signed-in pages.

`URLS='{"id":"https://..."}'` points any audit at a specific page.

## Known limits

- Sites that serve bot checks to automated browsers (Instagram, eBay, Etsy, Indeed, Booking.com, Expedia, Canva, Quora, Yelp and others) have to be checked by hand in a real Chrome.
- Saturated brand colors lose some saturation in a flipped page, because hue rotation clips outside sRGB.
- Expected false flags: consent banners, ad iframes, carousels, A/B home pages, line-clamped text and sites' own two-line labels.
