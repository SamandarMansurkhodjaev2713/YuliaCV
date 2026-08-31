import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { hasSeenIntro, markIntroSeen } from '../../../lib/introSession';
import styles from './Intro.module.css';

const INTRO_HOLD_MS = 1120;
const INTRO_EXIT_MS = 480;

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
    const appShell = document.getElementById('app-shell');
    appShell?.setAttribute('inert', '');
    appShell?.setAttribute('aria-hidden', 'true');
    const timeoutId = window.setTimeout(() => {
      markIntroSeen(window.sessionStorage);
      setIsVisible(false);
    }, INTRO_HOLD_MS);
    const unlockTimeoutId = window.setTimeout(() => {
      document.body.style.overflow = previousOverflow;
      appShell?.removeAttribute('inert');
      appShell?.removeAttribute('aria-hidden');
    }, INTRO_HOLD_MS + INTRO_EXIT_MS);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearTimeout(unlockTimeoutId);
      document.body.style.overflow = previousOverflow;
      appShell?.removeAttribute('inert');
      appShell?.removeAttribute('aria-hidden');
    };
  }, [isVisible, reduceMotion]);

  return (
    <AnimatePresence>
      {isVisible && !reduceMotion ? (
        <motion.div
          className={styles.overlay}
          data-testid="intro-overlay"
          aria-hidden="true"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: INTRO_EXIT_MS / 1000, ease: [0.65, 0, 0.35, 1] }}
        >
          <motion.div
            className={styles.metaTop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.28, delay: 0.08 }}
          >
            <span>PORTFOLIO / 00</span>
            <span>ТАШКЕНТ / 2026</span>
          </motion.div>
          <motion.span
            className={styles.signal}
            initial={{ opacity: 0, scale: 0.92, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            SMM
          </motion.span>
          <div className={styles.content}>
            <motion.div
              className={styles.mark}
              initial={{ opacity: 0, rotate: -8, scale: 0.92 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span>YB.</span><i />
            </motion.div>
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
            <div className={`${styles.mask} ${styles.surnameMask}`}>
              <motion.p
                className={styles.surname}
                initial={{ y: '-108%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.62, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                БРЫНСКИХ
              </motion.p>
            </div>
            <motion.p
              className={styles.role}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              SMM-СТРАТЕГИЯ · КОНТЕНТ
            </motion.p>
            <motion.span
              className={styles.line}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.52, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className={styles.sequence}>
              {['СМЫСЛ', 'СИСТЕМА', 'ДЕЙСТВИЕ'].map((label, index) => (
                <motion.span
                  key={label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, delay: 0.24 + index * 0.07 }}
                >
                  <i>{String(index + 1).padStart(2, '0')}</i>
                  {label}
                </motion.span>
              ))}
            </div>
          </div>
          <motion.div
            className={styles.metaBottom}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.34 }}
          >
            <span>VOICE → CONTENT → ACTION</span>
            <span>01 — 07</span>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
