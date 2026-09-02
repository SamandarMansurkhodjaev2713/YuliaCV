import type { Locale } from '../content/types';

export const LOCALE_STORAGE_KEY = 'yulia-portfolio:locale';
export const DEFAULT_LOCALE: Locale = 'ru';
export const LOCALES: readonly Locale[] = ['ru', 'en'];

export function isLocale(value: unknown): value is Locale {
  return value === 'ru' || value === 'en';
}

export function readStoredLocale(storage: Pick<Storage, 'getItem'> | null): Locale | null {
  if (!storage) return null;
  try {
    const value = storage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(value) ? value : null;
  } catch {
    return null;
  }
}

export function writeStoredLocale(storage: Pick<Storage, 'setItem'> | null, locale: Locale): void {
  if (!storage) return;
  try {
    storage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Storage can be unavailable in strict privacy modes; the choice simply is not remembered.
  }
}
