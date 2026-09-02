import { useContext } from 'react';
import { LocaleContext } from './localeContext';
import type { LocaleContextValue } from './localeContext';

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}
