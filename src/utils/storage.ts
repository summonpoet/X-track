import type { TrackedAccount, ApiKeys } from '../types';

const KEYS = {
  accounts: 'xtracker_accounts',
  apiKeys: 'xtracker_api_keys',
} as const;

const DEFAULT_NITTER = 'https://nitter.privacydev.net';

export function getAccounts(): TrackedAccount[] {
  try {
    const raw = localStorage.getItem(KEYS.accounts);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAccounts(accounts: TrackedAccount[]) {
  localStorage.setItem(KEYS.accounts, JSON.stringify(accounts));
}

export function getApiKeys(): ApiKeys {
  try {
    const raw = localStorage.getItem(KEYS.apiKeys);
    return raw
      ? JSON.parse(raw)
      : { nitterInstance: DEFAULT_NITTER, claudeApiKey: '' };
  } catch {
    return { nitterInstance: DEFAULT_NITTER, claudeApiKey: '' };
  }
}

export function saveApiKeys(keys: ApiKeys) {
  localStorage.setItem(KEYS.apiKeys, JSON.stringify(keys));
}
