import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

// The repository folder is the extension: Chrome loads it as it is. This writes the two generated files next to
// manifest.json (background.js and popup.js, bundled from src/) and the PNG toolbar icons rendered from icons/icon.svg.
const root = new URL('../', import.meta.url);
await build({ entryPoints: ['src/background.ts', 'src/popup.ts'],
  outdir: root.pathname, bundle: true, platform: 'browser', target: 'chrome120', format: 'iife',
  minify: true, legalComments: 'eof', logLevel: 'warning' });
const icon = await readFile(new URL('icons/icon.svg', root));
for (const size of [16, 32, 48, 128]) {
  await sharp(icon).resize(size, size).png().toFile(new URL(`icons/${size}.png`, root).pathname);
}
const manifest = JSON.parse(await readFile(new URL('manifest.json', root), 'utf8'));
const sourcePackage = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
if (manifest.version !== sourcePackage.version) throw new Error('Package and manifest versions must match');
if (manifest.description.length > 132) throw new Error('Chrome Web Store description is too long');
console.log(`Built net19 ${manifest.version} (load this folder in chrome://extensions)`);
