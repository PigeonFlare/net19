# Validation

## Automated (`npm run check`)

Typecheck, unit tests, production build, then Chromium tests that load the built extension against local fixtures (any outside request fails the test).

Unit tests cover the settings shape, host permissions matching the themed domains, per-site pause, the wiki legacy-skin URL rules, every `evidence/<id>.json` (each 2019 feature cites a source, each post-2019 one says what the theme does with it), and the stylesheet contract: no generated text, no script-computed layout, no `html, body` backgrounds, dark tokens wherever light ones exist, and themes never switching a site's own mode.

Browser tests check that:

- themed sites get their theme and other sites get nothing;
- Wikipedia gets `useskin=vector`;
- Reddit stays on reddit.com signed in or out, with no account check;
- a light site on a dark device is recolored, and pictures keep their exact pixel colors in both directions;
- the popup switches remove themes and rules as expected.

## Live audits

Run these for every theme you change, in both `SCHEME=light` and `SCHEME=dark`:

| Command | What it does |
| --- | --- |
| `npm run audit -- <id>` | Hovers header, sidebar and the first result titles, opens a menu, focuses and types into search; runs the page checks in every state, flags faint text, post-2019 labels and a search field that grows, moves, dims the page or cuts off its suggestions, and reports `TITLE CLICK` when a result title doesn't open |
| `npm run audit:diff -- <id>` | Runs the page checks with and without net19 and reports only what net19 introduced, including `contentlost` |
| `npm run audit:inventory -- <id>` | Lists every visible section, heading, control, tab, field and badge against `evidence/<id>.json`; must end with 0 unverified, 0 post-2019 still shown and 0 missing required 2019 features |
| `npm run audit:fit -- <id>` | Checks that the full theme still fits the live page (the weekly redesign check runs this for every site) |
| `npm run audit:nav -- <id>` | Follows header, menu, launcher and footer links; reports unstyled destinations |
| `npm run audit:rhythm -- <id>` | Pixel-based spacing and readability check (faint text, mismatched color patches, items padded unevenly); writes a crop gallery to review |
| `npm run audit:words` | Pairs each theme's labels across languages for `theme.words` |

`scripts/audit/page-checks.js` runs inside the page and reports `covered`, `offcenter`, `textoffcenter`, `overlap`, `lowcontrast` (contrast measured as actually shown), `dim`, `collide`, `cropped`, `effects`, `clipline`, `rowwrap`, `rowalign`, `spill`, `iconovertext` and `gap`; `AGENTS.md` says what each one means. Also use it on signed-in pages.

`URLS='{"id":"https://..."}'` points any audit at a specific page.

## Known limits

- Sites that serve bot checks to automated browsers (Instagram, eBay, Etsy, Indeed, Booking.com, Expedia, Canva, Quora, Yelp and others) have to be checked by hand in a real Chrome.
- Expected false flags: consent banners, ad iframes, carousels, A/B home pages, line-clamped text and sites' own two-line labels.
