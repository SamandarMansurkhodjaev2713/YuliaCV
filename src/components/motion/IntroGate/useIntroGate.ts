import { useContext } from 'react';
import { IntroGateContext } from './introGateContext';
import type { IntroGateValue } from './introGateContext';

export function useIntroGate(): IntroGateValue {
  return useContext(IntroGateContext);
}
