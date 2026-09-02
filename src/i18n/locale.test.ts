import { describe, expect, it, vi } from 'vitest';
import { LOCALE_STORAGE_KEY, isLocale, readStoredLocale, writeStoredLocale } from './locale';

describe('locale persistence', () => {
  it('GIVEN a supported or unsupported value WHEN checked THEN only ru and en pass', () => {
    expect(isLocale('ru')).toBe(true);
    expect(isLocale('en')).toBe(true);
    expect(isLocale('de')).toBe(false);
    expect(isLocale(null)).toBe(false);
  });

  it('GIVEN a stored choice WHEN read THEN it is returned, otherwise null', () => {
    expect(readStoredLocale({ getItem: vi.fn().mockReturnValue('en') })).toBe('en');
    expect(readStoredLocale({ getItem: vi.fn().mockReturnValue('xx') })).toBeNull();
    expect(readStoredLocale(null)).toBeNull();
  });

  it('GIVEN available storage WHEN written THEN the key is persisted', () => {
    const storage = { setItem: vi.fn() };
    writeStoredLocale(storage, 'en');
    expect(storage.setItem).toHaveBeenCalledWith(LOCALE_STORAGE_KEY, 'en');
  });

  it('GIVEN blocked storage WHEN accessed THEN nothing throws', () => {
    const blocked = () => {
      throw new Error('blocked');
    };
    expect(readStoredLocale({ getItem: blocked })).toBeNull();
    expect(() => writeStoredLocale({ setItem: blocked }, 'ru')).not.toThrow();
  });
});
