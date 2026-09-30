# Chrome Web Store

## Release

```sh
npm ci
npm run check
npm audit --omit=dev
npm run package   # artifacts/net19-<version>.zip
```

When you raise the version, change it in `manifest.json`, `package.json`, `package-lock.json`, and the `PRIVACY.md` header; `npm test` fails until they all match, and until the site counts in `PRIVACY.md` and `docs/ARCHITECTURE.md` match `src/themes.ts`.

## Listing

**Name:** net19

**Summary:** Websites as they looked in 2019.

**Description:**

net19 restyles more than 160 of the most visited websites, including Google, YouTube, Wikipedia, Reddit, Discord and the big news, shopping and game sites, to look as they did in 2019. Each look is designed by hand, applies before the page first appears, and follows your device's light or dark setting.

Wikipedia and other wikis open in their legacy skins, and Reddit feeds open in Reddit's own Classic and Card views.

The popup has two switches, net19 on or off and on or off for the current site, and a link to support development.

net19 runs on no other website and sends nothing anywhere: no account, server, analytics or telemetry. Some themes show a site's own older logos or fonts, which your browser loads from that site's own servers or, for a few sites' fonts, from a font service or file host (Google Fonts, Adobe Fonts, CloudFront).

## Disclosures

| Field | Value |
| --- | --- |
| Homepage | https://github.com/PigeonFlare/net19 |
| Support | https://github.com/PigeonFlare/net19/issues |
| Privacy policy | https://github.com/PigeonFlare/net19/blob/main/PRIVACY.md |
| Single purpose | Restyle a fixed set of websites to look as they did in 2019 |
| Host permissions | Only the themed sites, to apply their themes |
| `scripting` | Register bundled theme files at document start |
| `declarativeNetRequestWithHostAccess` | The legacy-skin parameter on Wikipedia and other wikis |
| `storage` | The two switches, and the site sections currently on a theme's safe layer |
| Remote code | None |
| Data | None collected or transmitted |

## Reviewer steps

1. Open youtube.com, google.com or github.com: the 2019 look applies on first load.
2. Open a Wikipedia article: the URL gains `useskin=vector`.
3. Open reddit.com: the home feed shows the 2019 Classic view (thumbnail left, title and actions to the right), and a community shows the Card view.
4. Turn the site or net19 off in the popup: the site is normal on its next load.

## Assets

- `icons/128.png`
- `docs/images/popup.png`
- `docs/images/promo-440.png` (440 × 280, optional)
