import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
import { buildStyles } from './styles.mjs';

const root = new URL('../', import.meta.url);
await build({ entryPoints: { background: 'src/background.ts', popup: 'src/popup.ts', content: 'src/content/index.js', main: 'src/content/main.js', runtime: 'src/content/runtime.js', safe: 'src/content/safe.js', 'safe-narrow': 'src/content/safe-narrow.js' },
  outdir: new URL('dist/', root).pathname, bundle: true, platform: 'browser', target: 'chrome120', format: 'iife',
  minify: !process.env.N19_PLAIN, keepNames: !!process.env.N19_PLAIN, legalComments: 'eof', logLevel: 'warning' });
await buildStyles(root);
const icon = await readFile(new URL('icons/logo.png', root));
for (const size of [16, 32, 48]) {
  await sharp(icon).resize(size, size).png().toFile(new URL(`icons/${size}.png`, root).pathname);
}
const STORE_ICON = 96, STORE_PADDING = 16, STORE_RADIUS = 18;
const rounded = Buffer.from(`<svg width="${STORE_ICON}" height="${STORE_ICON}"><rect width="${STORE_ICON}" height="${STORE_ICON}" rx="${STORE_RADIUS}" ry="${STORE_RADIUS}"/></svg>`);
const storeIcon = await sharp(icon).resize(STORE_ICON, STORE_ICON).composite([{ input: rounded, blend: 'dest-in' }]).png().toBuffer();
await sharp(storeIcon).extend({ top: STORE_PADDING, bottom: STORE_PADDING, left: STORE_PADDING, right: STORE_PADDING, background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(new URL('icons/128.png', root).pathname);
const manifest = JSON.parse(await readFile(new URL('manifest.json', root), 'utf8'));
const sourcePackage = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
if (manifest.version !== sourcePackage.version) throw new Error('Package and manifest versions must match');
if (manifest.description.length > 132) throw new Error('Chrome Web Store description is too long');
console.log(`Built net19 ${manifest.version} (load this folder in chrome://extensions)`);
