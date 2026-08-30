import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { hasSeenIntro, markIntroSeen } from '../../../lib/introSession';
import styles from './Intro.module.css';

const INTRO_DURATION_MS = 980;

export function Intro() {
  const reduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !hasSeenIntro(window.sessionStorage);
  });

  useEffect(() => {
    if (!isVisible) return undefined;
    if (reduceMotion) {
      markIntroSeen(window.sessionStorage);
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timeoutId = window.setTimeout(() => {
      markIntroSeen(window.sessionStorage);
      setIsVisible(false);
      document.body.style.overflow = previousOverflow;
    }, INTRO_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
      document.body.style.overflow = previousOverflow;
    };
  }, [isVisible, reduceMotion]);

  return (
    <AnimatePresence>
      {isVisible && !reduceMotion ? (
        <motion.div
          className={styles.overlay}
          data-testid="intro-overlay"
          aria-hidden="true"
          initial={{ clipPath: 'inset(0 0 0 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.content}>
            <div className={styles.mask}>
              <motion.p
                className={styles.name}
                initial={{ y: '108%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
              >
                ЮЛИЯ
              </motion.p>
            </div>
            <motion.p
              className={styles.role}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              SMM / MARKETING
            </motion.p>
            <motion.span
              className={styles.line}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.52, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.p
              className={styles.sequence}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.28 }}
            >
              ГОЛОС · СИСТЕМА · ДЕЙСТВИЕ
            </motion.p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
