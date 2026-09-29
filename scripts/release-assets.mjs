import { readdir, cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

await mkdir('docs/images', { recursive: true });
for (const filename of ['popup.png']) {
  const matches = [];
  for (const dir of await readdir('test-results', { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    try { await readFile(resolve('test-results', dir.name, filename)); matches.push(resolve('test-results', dir.name, filename)); } catch { }
  }
  if (matches.length !== 1) throw new Error(`Expected exactly one verified ${filename} screenshot`);
  await cp(matches[0], `docs/images/${filename}`);
}
const text = `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="280" viewBox="0 0 440 280"><rect width="440" height="280" fill="#fff"/><text x="100" y="68" fill="#202124" font-family="Arial,Helvetica,sans-serif" font-size="36" font-weight="bold">net19</text><text x="28" y="150" fill="#202124" font-family="Arial,Helvetica,sans-serif" font-size="24">Websites as they looked</text><text x="28" y="184" fill="#202124" font-family="Arial,Helvetica,sans-serif" font-size="24">in 2019.</text><text x="28" y="246" fill="#5f6368" font-family="Arial,Helvetica,sans-serif" font-size="13">Google · YouTube · Wikipedia · Reddit · GitHub · and many more</text></svg>`;
const logo = await sharp('icons/logo.png').resize(56, 56).png().toBuffer();
await sharp(Buffer.from(text)).composite([{ input: logo, left: 28, top: 28 }]).png({ palette: true }).toFile('docs/images/promo-440.png');
const version = JSON.parse(await readFile('package.json', 'utf8')).version;
console.log(`Prepared public screenshots, original promotional artwork for net19 ${version}.`);
