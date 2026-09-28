# net19

A Chrome extension that shows popular websites as they looked in **2019**.

[Download net19](https://github.com/henry-xli/net19/archive/refs/heads/main.zip) · [Privacy](PRIVACY.md) · [Architecture](docs/ARCHITECTURE.md) · [Validation](docs/VALIDATION.md)

## Install 
1. Clone the folder with `git clone https://github.com/henry-xli/net19.git`, or click **Code → Download ZIP** on GitHub and extract it.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and select the `net19` folder.

## Update
1. Run `git pull` in the `net19` folder if you cloned the extension, or replace the folder's contents if you downloaded the ZIP file.
2. Click the extension's **Reload** button once. Its card in `chrome://extensions` shows the currently-run version. 

## Features
- **150+ popular sites in their 2019 design:** All the major websites are individually designed and tested to look like their 2019 selves, from Youtube to Yandex. ([full list](src/themes.ts)). The targeted websites are US-centric, but I took care to cover major foreign websites like Telegram and WhatsApp. Each website design is lightly cached and applied before websites even load.
- **Minimal changes:** Many website features such as icons are left untouched. Websites that adhere to old design standards might be left completely intact. For example, Wikipedia opens in its legacy skin, and Reddit simply reroutes to old.reddit.com for users that are signed-in. Backend features such as search results and entry recommendations stay intact. Features added after 2019 such as AI integration and shorts are removed from display.
- **Individual website control:** If you like modern features on certain popular websites, like AI summaries on Google, you can disable the extension for those websites individually. You can also disable it entirely with another simple toggle.
- **Smaller websites are unaffected:** Smaller and personal websites load exactly as they are, so you don't need to worry about how the extension messes with more niche styles or indie work.
- **Minimal UI:** The extension features just two toggles, one to toggle it on and off for a particlar website, and the other to toggle it on and off in general. 
- **Color themes:** Naturally adapts websites to your computer's light or dark theme, while keeping the 2019 style, and maintaining true color for important media such as photos and videos. 
- **User privacy:** The extension runs completely locally. No user data is stored except for toggle choices. ([privacy policy](PRIVACY.md)).

## Report a problem or request a site

- **Something looks broken?** [Report a broken site](https://github.com/henry-xli/net19/issues/new?template=broken-site.yml)
- **Want a site themed?** [Request a site](https://github.com/henry-xli/net19/issues/new?template=site-request.yml). Add a 👍 to [existing requests](https://github.com/henry-xli/net19/issues?q=is%3Aissue+is%3Aopen+label%3A%22site+request%22+sort%3Areactions-%2B1-desc) instead of opening duplicates; the most-voted sites come first.

## Limits

Extension functionality could be negatively impacted by:
- Niche websites
- Niche features
- Niche bugs
- Major redesign
- New websites getting popular

Since this extension is open-source and well-organized, it should be trivial to mitigate these problems as they become apparent.

## Development

```sh
npm ci           # install needed tools once
npm run check    # build and run all tests
```

Site designs live in `themes/`, and the main background functionality lives in `src/`. `npm run build` turns `src/` into `background.js`, `popup.js` and `content.js`. Don't edit those three by hand; they're kept in the folder so it loads in Chrome without building. See [Architecture](docs/ARCHITECTURE.md) for how other parts of the extension work together.
