import { THEMES, themePaused } from './themes';
import type { Settings } from './settings';

type Rule = chrome.declarativeNetRequest.Rule;
const MAIN = ['main_frame' as chrome.declarativeNetRequest.ResourceType];
const GET = ['get' as chrome.declarativeNetRequest.RequestMethod];
const REDIRECT = 'redirect' as chrome.declarativeNetRequest.RuleActionType;

export function navigationRules(config: Settings, themes = THEMES): Rule[] {
  if (!config.enabled) return [];
  const rules: Rule[] = [];
  let id = 1;
  for (const theme of themes) {
    if (themePaused(theme, config.disabledHosts)) continue;
    if (theme.query) rules.push({ id: id++, priority: 1,
      action: { type: REDIRECT, redirect: { transform: { queryTransform: { addOrReplaceParams: theme.query.params.map(([key, value]) => ({ key, value })) } } } },
      condition: { regexFilter: theme.query.pattern, resourceTypes: MAIN, requestMethods: GET, ...(config.pausedSites.length ? { excludedRequestDomains: config.pausedSites.flatMap(site => [site, `www.${site}`]) } : {}) } });
  }
  return rules;
}
