import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { settingsFrom } from '../src/settings';
import { compileTheme } from '../scripts/styles.mjs';
import { THEMES, THEMED_DOMAINS, themeFiles, themeFor, themeMatches, themePaused } from '../src/themes';

const rule = (id: string) => THEMES.find(theme => theme.id === id)!;

test('settings keep only the two switches', () => {
  assert.deepEqual(settingsFrom(null), { enabled: true, disabledHosts: [] });
  assert.deepEqual(settingsFrom({ enabled: false, year: 2012, waitMs: 3000, disabledHosts: ['www.youtube.com', 'bad host', 7] }), { enabled: false, disabledHosts: ['www.youtube.com'] });
});

test('net19 only touches the sites it has a theme for', () => {
  const manifest = JSON.parse(readFileSync('manifest.json', 'utf8'));
  assert.deepEqual(manifest.host_permissions, THEMED_DOMAINS.map(domain => `*://*.${domain}/*`));
  assert.ok(!manifest.web_accessible_resources && !manifest.permissions.includes('offscreen') && !manifest.permissions.includes('webNavigation'));
  assert.ok(!manifest.permissions.includes('cookies'));
  assert.match(manifest.content_security_policy.extension_pages, /connect-src 'none';/);
  for (const theme of THEMES) {
    for (const file of [...themeFiles(theme).css, ...themeFiles(theme).js]) assert.ok(existsSync(file), `${theme.id}: ${file}`);
    for (const pattern of themeMatches(theme)) assert.ok(theme.domains.some(domain => pattern.includes(domain)), pattern);
  }
  assert.equal(themeFor('www.youtube.com')?.id, 'youtube');
  assert.equal(themeFor('m.youtube.com')?.id, 'youtube');
  assert.equal(themeFor('notyoutube.com'), undefined);
  assert.equal(themeFor('example.com'), undefined);
});

test('the per-site switch pauses the whole site, whichever host it was set on', () => {
  assert.ok(themePaused(rule('reddit'), ['reddit.com']));
  assert.ok(themePaused(rule('shreddit'), ['www.reddit.com']));
  assert.ok(themePaused(rule('reddit'), ['old.reddit.com']));
  assert.ok(!themePaused(rule('reddit'), ['notreddit.com', 'youtube.com']));
});

test('Wikipedia gets its legacy skin by URL parameter, once', () => {
  const { pattern } = rule('wikipedia').query!;
  assert.ok(new RegExp(pattern).test('https://en.wikipedia.org/wiki/Cat'));
  assert.ok(!new RegExp(pattern).test('https://en.wikipedia.org/wiki/Cat?useskin=vector'));
});


test('theme stylesheets follow the styling-rule contract', () => {
  for (const file of readdirSync('themes').filter(name => name.endsWith('.css'))) {
    const css = readFileSync(`themes/${file}`, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    assert.ok(!/content:\s*["'][^"']+["']/.test(css), `${file}: generated text`);
    assert.ok(!/--ytd-rich-grid-items-per-row/.test(css), `${file}: script-computed layout variable`);
    assert.ok(!/(^|})\s*html\s*,\s*body\s*\{[^}]*background/.test(css), `${file}: html/body background`);
    if (/--n19-[a-z0-9-]+\s*:/.test(css)) assert.ok(/data-net19-mode="dark"/.test(css) || !/html\s*\{\s*--n19/.test(css), `${file}: tokens without a dark variant`);
  }
  for (const file of readdirSync('themes').filter(name => name.endsWith('.js'))) {
    const js = readFileSync(`themes/${file}`, 'utf8');
    assert.ok(/globalThis\.net19Theme\s*=/.test(js), `${file}: no theme config`);
    assert.ok(!/removeAttribute\('dark'\)|classList\.remove\([^)]*dark/i.test(js), `${file}: overrides the site's mode`);
  }
});

test('theme geometry is gated so a theme can step back to its colors, fonts and hidden features', () => {
  const css = compileTheme('html { --n19-a: 1px; } .card { color: red; display: none; background: url(x.png); width: 2px; background-color: blue } html[data-x] .bar { margin: 0 } [data-y] { display: flex }');
  assert.equal(css, [
    'html{--n19-a:1px}',
    '.card{color:red;display:none;background:url(x.png)}',
    ':where(:root:not([data-n19-safe])) .card,.card:where(:root:not([data-n19-safe])){width:2px}',
    '.card{background-color:blue}',
    'html[data-x]:where(:root:not([data-n19-safe])) .bar{margin:0}',
    ':where(:root:not([data-n19-safe])) [data-y],[data-y]:where(:root:not([data-n19-safe])){display:flex}',
    '',
  ].join('\n'));
  assert.equal(compileTheme('html[data-g] { & a { color: red; order: 1 } @media (min-width: 9px) { & b { top: 0 } } } ::selection { width: 0 }'), [
    ':is(html[data-g]) a{color:red}',
    ':where(:root:not([data-n19-safe])) :is(html[data-g]) a,:is(html[data-g]):where(:root:not([data-n19-safe])) a{order:1}',
    '@media (min-width:9px){:where(:root:not([data-n19-safe])) :is(html[data-g]) b,:is(html[data-g]):where(:root:not([data-n19-safe])) b{top:0}}',
    ':where(:root:not([data-n19-safe])) ::selection,:where(:root:not([data-n19-safe]))::selection{width:0}',
    '',
  ].join('\n'));
});

test('built stylesheets are up to date with themes/', () => {
  for (const file of readdirSync('themes').filter(name => name.endsWith('.css'))) {
    assert.equal(readFileSync(`built/${file}`, 'utf8'), compileTheme(readFileSync(`themes/${file}`, 'utf8')), `built/${file} is stale: run npm run build`);
  }
  assert.deepEqual(readdirSync('built').sort(), readdirSync('themes').filter(name => name.endsWith('.css')).sort());
});

test('evidence files back every 2019 feature with a source and name what they hide', () => {
  for (const file of readdirSync('evidence').filter(name => name.endsWith('.json'))) {
    const evidence = JSON.parse(readFileSync(`evidence/${file}`, 'utf8'));
    const id = file.replace(/\.json$/, '');
    assert.ok(existsSync(`themes/${id}.css`), `${file}: no theme named ${id}`);
    assert.ok(Array.isArray(evidence.sources) && evidence.sources.length >= 1, `${file}: no sources`);
    assert.ok(Array.isArray(evidence.features) && evidence.features.length, `${file}: no features`);
    const sources = new Set(evidence.sources.map((source: { id: string }) => source.id));
    for (const feature of evidence.features) {
      assert.doesNotThrow(() => new RegExp(feature.match, 'i'), `${file}: bad match ${feature.match}`);
      assert.equal(typeof feature.in2019, 'boolean', `${file}: ${feature.match} has no in2019`);
      if (feature.in2019) assert.ok([].concat(feature.evidence || []).some((ref: string) => sources.has(ref) || /^https?:/.test(ref)), `${file}: ${feature.match} cites no 2019 source`);
    }
  }
});

test('docs and metadata describe the current release', () => {
  const version = JSON.parse(readFileSync('manifest.json', 'utf8')).version;
  const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
  assert.equal(JSON.parse(readFileSync('package.json', 'utf8')).version, version);
  assert.equal(lock.version, version);
  assert.equal(lock.packages[''].version, version);
  assert.match(readFileSync('PRIVACY.md', 'utf8'), new RegExp(`Applies to net19 ${version.replace(/\./g, '\\.')}\\.`));
  const counted = `${THEMES.length} `;
  for (const file of ['PRIVACY.md', 'docs/ARCHITECTURE.md']) {
    const text = readFileSync(file, 'utf8');
    for (const [, count] of text.matchAll(/\b(\d{3}) (?:popular websites|sites|themes)\b/g)) assert.equal(`${count} `, counted, `${file}: ${count} themes`);
  }
});
