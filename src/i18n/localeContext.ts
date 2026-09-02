import { createContext } from 'react';
import { siteContent } from '../content/site';
import type { Locale, SiteContent } from '../content/types';

export interface LocaleContextValue {
  readonly locale: Locale;
  readonly content: SiteContent;
  readonly setLocale: (locale: Locale) => void;
}

export const LocaleContext = createContext<LocaleContextValue>({
  locale: 'ru',
  content: siteContent,
  setLocale: () => undefined,
});
