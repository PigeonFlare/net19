# net19

A Chrome extension that shows popular websites as they looked in **2019**.

[Github download](https://github.com/PigeonFlare/net19/archive/refs/heads/main.zip) · [Chrome download](https://chromewebstore.google.com/detail/net19/aomcmjccojigoiehgcomlpbiabllpeif) · [Privacy](PRIVACY.md) · [Architecture](docs/ARCHITECTURE.md) · [Validation](docs/VALIDATION.md)

## Install 
1. Clone the folder with `git clone https://github.com/PigeonFlare/net19.git`, or click **Code → Download ZIP** on GitHub and extract it.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and select the `net19` folder.

## Update
1. Run `git pull` in the `net19` folder if you cloned the extension, or replace the folder's contents if you downloaded the ZIP file.
2. Click the extension's **Reload** button once. Its card in `chrome://extensions` shows the currently-run version. 

## Features
- **160+ popular sites in their 2019 design:** All the major websites are individually designed and tested to look like their 2019 selves, from YouTube to Yandex ([full list](src/themes.ts)). Every design is checked against real 2019 screenshots of the site. The targeted websites are US-centric, but I took care to cover major foreign websites like Telegram and WhatsApp. Each design is bundled with the extension and applied before the page first appears.
- **Minimal changes:** Many website features such as icons are left untouched. Websites that adhere to old design standards might be left completely intact. For example, Wikipedia and other wikis open in their legacy skins, and Reddit feeds open in Reddit's own Classic and Card views. Backend features such as search results and entry recommendations stay intact. Features added after 2019 such as AI integration and shorts are removed from display.
- **Individual website control:** If you like modern features on certain popular websites, like AI summaries on Google, you can disable the extension for those websites individually. You can also disable it entirely with another simple toggle.
- **Smaller websites are unaffected:** Smaller and personal websites load exactly as they are, so you don't need to worry about how the extension messes with more niche styles or indie work.
- **Minimal UI:** The extension features just two toggles, one to toggle it on and off for a particular website, and the other to toggle it on and off in general, plus a "Support further development" link. 
- **Color themes:** Naturally adapts websites to your computer's light or dark theme, while keeping the 2019 style, and maintaining true color for important media such as photos and videos. 
- **Survives redesigns:** If a site redesign stops a design from fitting, that part of the site falls back to its 2019 colors and fonts on the current layout instead of breaking (post-2019 features stay hidden), and switches back once the design fits again. A weekly check flags the design for an update.
- **Any screen, any Chromium browser:** Works in Chrome, Edge, Brave, Opera, Vivaldi and Arc on computers and Chromebooks, and in Android browsers that support extensions (Edge, Lemur, Yandex). On phones and narrow windows, sites keep their own mobile layout with the 2019 colors and fonts, so nothing gets squeezed or cut off.
- **User privacy:** The extension runs completely locally. No user data is stored except for toggle choices, and the names of site sections whose design currently doesn't fit. ([privacy policy](PRIVACY.md)).

## Complementary projects I found which you should try out 

[Old Twitter Layout](https://github.com/dimdenGD/OldTwitter) by dimden

[YouTube Redux](https://github.com/omnidevZero/YouTubeRedux) by omnidevZero 

## Report a problem or request a site

- **Something looks broken?** [Report a broken site](https://github.com/PigeonFlare/net19/issues/new?template=broken-site.yml)
- **Want a site themed?** [Request a site](https://github.com/PigeonFlare/net19/issues/new?template=site-request.yml). Add a thumbs up to [existing requests](https://github.com/PigeonFlare/net19/issues?q=is%3Aissue+is%3Aopen+label%3A%22site+request%22+sort%3Areactions-%2B1-desc) to boost them instead of opening duplicates. Remember that major websites might lack a tailored theme if they had a similar design in 2019, so screenshots from 2019 are much appreciated.

## Limits

Extension functionality could be lacking in the case of:
- Niche websites, features, and bugs
- Major design updates
- Newly popular websites

Since this extension is open-source and well-organized, it should be trivial to mitigate these problems if they become too serious.

## Development

```sh
npm ci           # install needed tools once
npm run check    # build and run all tests
```

Site designs live in `themes/`, and the main background functionality lives in `src/`. `npm run build` turns `src/` into `background.js`, `popup.js` and `content.js`. Don't edit those three by hand; they're kept in the folder so it loads in Chrome without building. See [Architecture](docs/ARCHITECTURE.md) for how other parts of the extension work together.
