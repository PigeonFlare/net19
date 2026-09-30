export const SETTINGS_KEY = 'settings';

export type Settings = {
  enabled: boolean;
  disabledHosts: string[];
  pausedSites: string[];
};

export function settingsFrom(value: unknown): Settings {
  const v = (value && typeof value === 'object' ? value : {}) as Partial<Settings>;
  const hosts = (list: unknown) => Array.isArray(list) ? [...new Set(list.filter(h => typeof h === 'string' && /^[a-z0-9.-]{1,253}$/.test(h)))].slice(0, 500) : [];
  return {
    enabled: v.enabled !== false,
    disabledHosts: hosts(v.disabledHosts),
    pausedSites: hosts(v.pausedSites),
  };
}

