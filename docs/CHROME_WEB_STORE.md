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

The name and summary come from the package (`_locales/<language>/messages.json`, English in `en`), so the store shows a translated title and summary to people browsing in Spanish, Portuguese, French, German, Italian, Japanese, Korean, Russian and Chinese. The store limits the name to 75 characters and the summary to 132.

**Name:** net19: Old 2019 Layout for YouTube, Reddit & More

**Summary:** Bring back the classic 2019 look of YouTube, Reddit, Google, Twitter, Gmail, Amazon and 170+ other sites. Light and dark mode. Free.

**Description:**

Miss the old YouTube layout, classic Reddit, or the Google and Twitter you were used to? net19 brings back the 2019 design of 170+ popular websites, with no Shorts shelves, AI summaries or redesign clutter.

Every few months the sites we use every day get overhauled without our input. One day short videos cover everyone's feed, the next there's an AI ready to summarize every post. net19 freezes their design at a time when it felt more functional.

What you get
• The old 2019 layout of YouTube, Reddit, Google Search, Gmail, Google Docs, Twitter (X), Discord, Twitch, Amazon, GitHub, Wikipedia, Instagram, Facebook and many news, shopping and gaming sites
• Post-2019 features such as Shorts, AI answers and new promo banners hidden, while everything you use keeps working
• Old Reddit's Classic and Card views, and Wikipedia's classic Vector skin
• Light and dark mode that follow your device
• The 2019 look applied before the page appears, with no flash of the new design
• A switch to turn net19 off for any single site, or everywhere

Private and open source
net19 runs only on the sites it restyles and sends nothing anywhere: no account, no server, no analytics, no tracking. The code is open source on GitHub, so anyone can check what it does.

Recommend a website or report an issue: https://github.com/PigeonFlare/net19/issues

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
