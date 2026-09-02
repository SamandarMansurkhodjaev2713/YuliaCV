import { en } from './en';
import { ru } from './ru';
import type { Locale, SiteContent } from './types';

export const locales: Readonly<Record<Locale, SiteContent>> = { ru, en };

/** Default (Russian) content. Components read the active locale through `useLocale()`. */
export const siteContent: SiteContent = ru;
