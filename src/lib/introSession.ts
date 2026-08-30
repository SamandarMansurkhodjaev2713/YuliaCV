export const INTRO_SESSION_KEY = 'yulia-portfolio:intro-seen';

export function hasSeenIntro(storage: Pick<Storage, 'getItem'> | null): boolean {
  if (!storage) return true;
  try {
    return storage.getItem(INTRO_SESSION_KEY) === '1';
  } catch {
    return true;
  }
}

export function markIntroSeen(storage: Pick<Storage, 'setItem'> | null): void {
  if (!storage) return;
  try {
    storage.setItem(INTRO_SESSION_KEY, '1');
  } catch {
    // Storage can be unavailable in strict privacy modes; the site remains fully usable.
  }
}
