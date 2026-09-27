# net19

A Chrome extension that shows popular websites as they looked in **2019**.

[Download net19](https://github.com/henry-xli/net19/archive/refs/heads/main.zip) · [Privacy](PRIVACY.md) · [Architecture](docs/ARCHITECTURE.md) · [Validation](docs/VALIDATION.md)

## Install or update

This folder is the extension: `manifest.json` sits at the top, and it always holds the current version only.

1. Get the folder:
   - clone it with `git clone https://github.com/henry-xli/net19.git`, or
   - click **Code → Download ZIP** on GitHub and extract it.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and select the `net19` folder itself.

To update:

- If you cloned it, run `git pull` in the folder.
- If you downloaded the ZIP, replace the folder's contents.

Then click the extension's **Reload** button once. Its card in `chrome://extensions` shows the version you are running.

## What you get

- **141 popular sites in their 2019 design:** Google, YouTube, Wikipedia, Reddit, Amazon, the big news, social and game sites, and more ([full list](src/themes.ts)). Each is designed by hand, applies before the page first paints, and covers every page you click to.
- **Everything else stays normal:** small and personal websites, and any site not on the list, load exactly as they are.
- **Two switches:** the popup turns net19 on or off, and on or off for the site you're on.
- **Your light or dark setting:** every themed site follows it, and photos and videos keep their real colors.
- **Only the design changes:** search results and recommendations stay as the site gives them. Features added after 2019 are removed, such as Google's AI answers, YouTube Shorts and assistant buttons.
- **Older frontends where they still exist:** Wikipedia opens in its legacy skin, and Reddit opens on old.reddit.com while you're signed in.
- **Private:** no network requests of its own, and nothing stored but the two switches ([privacy policy](PRIVACY.md)).

## Limits

- Where a site's layout changed since 2019, net19 restyles today's layout rather than rebuilding the old one.
- A site redesign can break parts of its theme until the theme is updated.

## Development

```sh
npm ci
npm run check
```

Themes live in `themes/`, and everything else hand-written lives in `src/`. `npm run build` regenerates `background.js`, `popup.js` and `content.js`, which are committed so the folder loads without building. [Architecture](docs/ARCHITECTURE.md) maps out the rest.
