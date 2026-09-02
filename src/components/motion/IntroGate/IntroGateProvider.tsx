import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { hasSeenIntro } from '../../../lib/introSession';
import { IntroGateContext } from './introGateContext';

function shouldPlayIntro(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  // Deep links and restored scroll positions land mid-page; the handoff only makes sense from the top.
  if (window.location.hash || window.scrollY > 0) return false;
  return !hasSeenIntro(window.sessionStorage);
}

export function IntroGateProvider({ children }: { readonly children: ReactNode }) {
  const [introActive, setIntroActive] = useState(shouldPlayIntro);
  const finishIntro = useCallback(() => setIntroActive(false), []);
  const value = useMemo(() => ({ introActive, finishIntro }), [introActive, finishIntro]);
  return <IntroGateContext.Provider value={value}>{children}</IntroGateContext.Provider>;
}
