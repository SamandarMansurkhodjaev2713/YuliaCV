import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { locales } from '../content/site';
import type { Locale } from '../content/types';
import { DEFAULT_LOCALE, readStoredLocale, writeStoredLocale } from './locale';
import { LocaleContext } from './localeContext';

function readInitialLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  return readStoredLocale(window.localStorage) ?? DEFAULT_LOCALE;
}

export function LocaleProvider({ children }: { readonly children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale);
  const content = locales[locale];

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    writeStoredLocale(window.localStorage, next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = content.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', content.meta.description);
  }, [locale, content]);

  const value = useMemo(() => ({ locale, content, setLocale }), [locale, content, setLocale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
