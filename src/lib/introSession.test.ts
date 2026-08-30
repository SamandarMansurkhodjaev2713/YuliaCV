import { describe, expect, it, vi } from 'vitest';
import { hasSeenIntro, INTRO_SESSION_KEY, markIntroSeen } from './introSession';

describe('intro session state', () => {
  it('GIVEN an empty session WHEN checked THEN the intro has not been seen', () => {
    const storage = { getItem: vi.fn().mockReturnValue(null) };
    expect(hasSeenIntro(storage)).toBe(false);
    expect(storage.getItem).toHaveBeenCalledWith(INTRO_SESSION_KEY);
  });

  it('GIVEN a completed session WHEN checked THEN the intro is skipped', () => {
    const storage = { getItem: vi.fn().mockReturnValue('1') };
    expect(hasSeenIntro(storage)).toBe(true);
  });

  it('GIVEN available storage WHEN completed THEN the session marker is persisted', () => {
    const storage = { setItem: vi.fn() };
    markIntroSeen(storage);
    expect(storage.setItem).toHaveBeenCalledWith(INTRO_SESSION_KEY, '1');
  });

  it('GIVEN unavailable storage WHEN accessed THEN the site degrades without throwing', () => {
    const readStorage = { getItem: vi.fn(() => { throw new Error('blocked'); }) };
    const writeStorage = { setItem: vi.fn(() => { throw new Error('blocked'); }) };
    expect(hasSeenIntro(readStorage)).toBe(true);
    expect(() => markIntroSeen(writeStorage)).not.toThrow();
  });
});
