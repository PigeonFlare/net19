import { zipSync } from 'fflate';
import { readdir, readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const EXTENSION = /^(?:icons\/\d+\.png|dist\/(?:background|popup|content|main|runtime|safe|safe-narrow)\.js|dist\/themes\/[a-z0-9]+\.css|popup\.html|ui\.css|themes\/[a-z0-9]+\.js|manifest\.json)$/;
const SOURCES = /^(?:themes\/[a-z0-9]+\.css|icons\/logo\.png)$/;
const files = {};
async function collect(directory, prefix = '') {
  for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const name = prefix + entry.name;
    if (entry.isDirectory()) { if ((!prefix && ['icons', 'themes', 'dist'].includes(entry.name)) || name === 'dist/themes') await collect(new URL(entry.name + '/', directory), name + '/'); }
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
const KEPT_RELEASES = 2;
const byVersion = (a, b) => b.split('.').map(Number).reduce((order, part, i) => order || part - Number(a.split('.')[i]), 0);
const released = (await readdir(new URL('../artifacts/', import.meta.url))).map(name => /^net19-(\d+\.\d+\.\d+)\.zip$/.exec(name)?.[1]).filter(Boolean).sort(byVersion);
const retired = released.slice(KEPT_RELEASES);
for (const version of retired) for (const name of [`net19-${version}.zip`, `net19-${version}.zip.sha256`]) await rm(new URL(`../artifacts/${name}`, import.meta.url), { force: true });
console.log(`Packaged ${Object.keys(files).length} files, ${(archive.length / 1024).toFixed(0)} KB → artifacts/net19-${manifest.version}.zip\nSHA-256 ${hash}${retired.length ? `\nRemoved older releases: ${retired.join(', ')}` : ''}`);
