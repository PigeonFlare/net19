import { zipSync } from 'fflate';
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const EXTENSION = /^(?:icons\/\d+\.png|dist\/(?:background|popup|content|main|runtime|safe|safe-narrow)\.js|dist\/themes\/[a-z0-9]+\.css|popup\.html|ui\.css|themes\/[a-z0-9]+\.js|manifest\.json|_locales\/[a-zA-Z_]+\/messages\.json)$/;
const SOURCES = /^(?:themes\/[a-z0-9]+\.css|icons\/logo\.png)$/;
const files = {};
async function collect(directory, prefix = '') {
  for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const name = prefix + entry.name;
    if (entry.isDirectory()) { if ((!prefix && ['icons', 'themes', 'dist', '_locales'].includes(entry.name)) || name === 'dist/themes' || name.startsWith('_locales/')) await collect(new URL(entry.name + '/', directory), name + '/'); }
    else if (EXTENSION.test(name)) files[name] = new Uint8Array(await readFile(new URL(entry.name, directory)));
    else if (prefix && !SOURCES.test(name)) throw new Error(`Unexpected file in the extension: ${name}`);
  }
}
await collect(root);
const manifest = JSON.parse(new TextDecoder().decode(files['manifest.json']));
const archive = zipSync(files, { level: 9, mtime: new Date(2000, 0, 1, 0, 0, 0) });
const output = new URL(`../artifacts/net19-${manifest.version}.zip`, import.meta.url);
await mkdir(new URL('../artifacts/', import.meta.url), { recursive: true });
await writeFile(output, archive);
const hash = createHash('sha256').update(archive).digest('hex');
await writeFile(new URL(output.href + '.sha256'), `${hash}  net19-${manifest.version}.zip\n`);
console.log(`Packaged ${Object.keys(files).length} files, ${(archive.length / 1024).toFixed(0)} KB → artifacts/net19-${manifest.version}.zip\nSHA-256 ${hash}`);
