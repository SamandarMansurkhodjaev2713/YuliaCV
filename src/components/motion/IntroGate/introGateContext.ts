import { createContext } from 'react';

export interface IntroGateValue {
  /** True while the intro overlay owns the screen; hero entrance waits for it to finish. */
  readonly introActive: boolean;
  readonly finishIntro: () => void;
}

export const IntroGateContext = createContext<IntroGateValue>({
  introActive: false,
  finishIntro: () => undefined,
});
