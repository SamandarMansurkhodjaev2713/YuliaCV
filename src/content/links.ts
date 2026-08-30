import type { ExternalUrl } from './types';

const ALLOWED_SOCIAL_HOSTS = new Set(['t.me', 'telegram.me', 'instagram.com', 'www.instagram.com']);

export function isAllowedSocialUrl(value: string): value is ExternalUrl {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ALLOWED_SOCIAL_HOSTS.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}
