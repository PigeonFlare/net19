# Chrome Web Store

## Release

```sh
npm ci
npm run check
npm audit --omit=dev
npm run package   # artifacts/net19-<version>.zip
```

Keep the version in `package.json` and `manifest.json` in sync.

## Listing

**Name:** net19

**Summary:** Websites as they looked in 2019.

**Description:**

net19 restyles well over a hundred of the most visited websites, including Google, YouTube, Wikipedia, Reddit, Discord and the big news, shopping and game sites, to look as they did in 2019. Each look is designed by hand, applies before the page first appears, and follows your device's light or dark setting.

Wikipedia opens in its legacy Vector skin, and signed-in Reddit opens on old.reddit.com.

The popup has two switches: net19 on or off, and on or off for the current site.

net19 makes no network requests and runs on no other website. No account, server, analytics or telemetry.

## Disclosures

| Field | Value |
| --- | --- |
| Homepage | https://github.com/henry-xli/net19 |
| Support | https://github.com/henry-xli/net19/issues |
| Privacy policy | https://github.com/henry-xli/net19/blob/main/PRIVACY.md |
| Single purpose | Restyle a fixed set of websites to look as they did in 2019 |
| Host permissions | Only the themed sites, to apply their themes |
| `scripting` | Register bundled theme files at document start |
| `declarativeNetRequestWithHostAccess` | Wikipedia legacy-skin parameter; signed-in Reddit to old.reddit.com |
| `cookies` | Check whether a Reddit session cookie exists; its value is never stored or sent |
| `storage` | The two switches |
| Remote code | None |
| Data | None collected or transmitted |

## Reviewer steps

1. Open youtube.com, google.com or github.com: the 2019 look applies on first load.
2. Open a Wikipedia article: the URL gains `useskin=vector`.
3. Sign in to Reddit and open reddit.com: it opens on old.reddit.com.
4. Turn the site or net19 off in the popup: the site is normal on its next load.

## Assets

- `icons/128.png`
- `docs/images/popup.png`
- `docs/images/promo-440.png` (440 × 280, optional)
