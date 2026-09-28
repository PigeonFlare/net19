import { type Settings } from './settings';
import { themeFor, themePaused, type HandmadeTheme } from './themes';

type State = { settings: Settings };

async function send<T>(type: string, extra: object = {}): Promise<T> {
  const response = await chrome.runtime.sendMessage({ type, ...extra });
  if (response?.error) throw new Error(response.error);
  return response as T;
}

const power = document.getElementById('power') as HTMLInputElement;
const siteSwitch = document.getElementById('site-switch') as HTMLInputElement;
let settings: Settings;
let theme: HandmadeTheme | undefined;

function paint(): void {
  power.checked = settings.enabled;
  siteSwitch.checked = !!theme && !themePaused(theme, settings.disabledHosts);
  siteSwitch.disabled = !settings.enabled;
}
async function save(patch: Partial<Settings>): Promise<void> {
  settings = await send<Settings>('SETTINGS', { patch });
  paint();
}
power.addEventListener('change', () => { void save({ enabled: power.checked }).catch(paint); });
siteSwitch.addEventListener('change', () => {
  if (!theme) return;
  const site = theme;
  const hosts = settings.disabledHosts.filter(host => !themePaused(site, [host]));
  if (!siteSwitch.checked) hosts.push(site.domains[0]);
  void save({ disabledHosts: hosts }).catch(paint);
});

const isWeb = (tab?: chrome.tabs.Tab) => !!tab?.url && /^https?:/.test(tab.url);
async function siteTab(): Promise<chrome.tabs.Tab | undefined> {
  const self = await chrome.tabs.getCurrent().catch(() => undefined);
  if (!self) return (await chrome.tabs.query({ active: true, currentWindow: true }))[0];
  if (self.openerTabId !== undefined) {
    const opener = await chrome.tabs.get(self.openerTabId).catch(() => undefined);
    if (isWeb(opener)) return opener;
  }
  const others = (await chrome.tabs.query({ windowId: self.windowId })).filter(tab => tab.id !== self.id && isWeb(tab)) as Array<chrome.tabs.Tab & { lastAccessed?: number }>;
  return others.sort((a, b) => (b.lastAccessed ?? 0) - (a.lastAccessed ?? 0))[0];
}

void (async () => {
  const [state, tab] = await Promise.all([send<State>('STATE'), siteTab()]);
  settings = state.settings;
  let host = '';
  try { if (tab?.url && !tab.incognito && /^https?:$/.test(new URL(tab.url).protocol)) host = new URL(tab.url).hostname; } catch { }
  theme = host ? themeFor(host) : undefined;
  if (theme) {
    document.getElementById('site')!.textContent = theme.domains.find(domain => host === domain || host.endsWith(`.${domain}`)) ?? theme.domains[0];
    siteSwitch.setAttribute('aria-label', theme.name);
    document.getElementById('site-row')!.hidden = false;
  }
  paint();
})();
