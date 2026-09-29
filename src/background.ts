import { settingsFrom, SETTINGS_KEY, type Settings } from './settings';
import { THEMES, themeFiles, themeMatches, themePaused, type HandmadeTheme } from './themes';
import { navigationRules } from './navigation';

let sync: Promise<unknown> = Promise.resolve();
let settingsWrites: Promise<unknown> = Promise.resolve();

async function settings(): Promise<Settings> {
  return settingsFrom((await chrome.storage.local.get(SETTINGS_KEY))[SETTINGS_KEY]);
}

function syncScripts(): Promise<unknown> {
  sync = sync.catch(() => undefined).then(async () => {
    const [config, registered] = await Promise.all([settings(), chrome.scripting.getRegisteredContentScripts()]);
    const active = (theme: HandmadeTheme) => config.enabled && !themePaused(theme, config.disabledHosts);
    const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: oldRules.map(rule => rule.id),
      addRules: navigationRules(config) });
    const desired: chrome.scripting.RegisteredContentScript[] = THEMES.filter(active).map(theme => ({
      id: `net19-theme-${theme.id}`, matches: themeMatches(theme), ...(theme.exclude ? { excludeMatches: theme.exclude } : {}), ...themeFiles(theme), runAt: 'document_start', allFrames: !!theme.frames, persistAcrossSessions: true }));
    const watched = [...new Set(THEMES.filter(active).flatMap(themeMatches))].sort();
    if (watched.length) desired.push({ id: 'net19-watch', matches: watched, js: ['main.js'], world: 'MAIN', runAt: 'document_start', persistAcrossSessions: true });
    const signature = (list: chrome.scripting.RegisteredContentScript[]) => JSON.stringify(list.map(s => [s.id, [...s.matches ?? []].sort(), [...s.excludeMatches ?? []].sort(), s.css, s.js, !!s.allFrames, s.world ?? 'ISOLATED']).sort());
    const current = registered.filter(script => script.id.startsWith('net19-'));
    if (signature(current) !== signature(desired)) {
      if (current.length) await chrome.scripting.unregisterContentScripts({ ids: current.map(script => script.id) });
      if (desired.length) await chrome.scripting.registerContentScripts(desired);
    }
  });
  return sync;
}

async function cleanUp(): Promise<void> {
  const stored = await chrome.storage.local.get(null);
  const stale = Object.keys(stored).filter(key => key !== SETTINGS_KEY);
  if (stale.length) await chrome.storage.local.remove(stale);
  await chrome.storage.session.clear();
  const session = await chrome.declarativeNetRequest.getSessionRules();
  if (session.length) await chrome.declarativeNetRequest.updateSessionRules({ removeRuleIds: session.map(rule => rule.id) });
}

function isPopup(sender: chrome.runtime.MessageSender): boolean {
  return sender.id === chrome.runtime.id && sender.url?.split(/[?#]/)[0] === chrome.runtime.getURL('popup.html');
}

async function handle(message: unknown, sender: chrome.runtime.MessageSender): Promise<unknown> {
  if (!message || typeof message !== 'object' || !isPopup(sender)) throw new Error('Invalid sender');
  const m = message as { type?: string; patch?: Partial<Settings> };
  if (m.type === 'STATE') return { settings: await settings() };
  if (m.type === 'SETTINGS') {
    const change = settingsWrites.catch(() => undefined).then(async () => {
      const config = settingsFrom({ ...await settings(), ...m.patch });
      await chrome.storage.local.set({ [SETTINGS_KEY]: config });
      await syncScripts();
      return config;
    });
    settingsWrites = change;
    return change;
  }
  throw new Error('Unknown net19 action');
}

chrome.runtime.onMessage.addListener((message, sender, respond) => {
  void handle(message, sender).then(respond, () => respond({ error: 'net19 could not complete this action.' }));
  return true;
});
chrome.runtime.onInstalled.addListener(() => { void cleanUp().catch(() => undefined).then(syncScripts).catch(() => undefined); });
chrome.runtime.onStartup.addListener(() => { void syncScripts().catch(() => undefined); });
