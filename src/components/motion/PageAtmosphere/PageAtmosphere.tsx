import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { useEffect } from 'react';
import { useChapterProgress } from '../../../hooks/useChapterProgress';
import { useLocale } from '../../../i18n/useLocale';
import { CHAPTER_COUNT, pad } from '../../../lib/sections';
import styles from './PageAtmosphere.module.css';

/**
 * Ambient layer: a story-style progress bar (one segment per chapter), page rules,
 * a chapter folio and a pointer trace that grows over interactive elements.
 */
export function PageAtmosphere() {
  const reduceMotion = useReducedMotion();
  const { content } = useLocale();
  const { activeIndex, count, tone, progress } = useChapterProgress();
  const fill = useSpring(progress, { stiffness: 160, damping: 32, mass: 0.3 });

  const pointerX = useMotionValue(-80);
  const pointerY = useMotionValue(-80);
  const hover = useMotionValue(0);
  const presence = useMotionValue(0);
  const traceX = useSpring(pointerX, { stiffness: 190, damping: 26, mass: 0.2 });
  const traceY = useSpring(pointerY, { stiffness: 190, damping: 26, mass: 0.2 });
  const traceScale = useSpring(useTransform(hover, [0, 1], [1, 2.1]), { stiffness: 220, damping: 24 });
  const traceOpacity = useSpring(presence, { stiffness: 120, damping: 24 });

  useEffect(() => {
    if (reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    let frameId = 0;
    let idleId = 0;
    let nextX = -80;
    let nextY = -80;
    const commit = () => {
      frameId = 0;
      pointerX.set(nextX);
      pointerY.set(nextY);
    };
    const handleMove = (event: PointerEvent) => {
      nextX = event.clientX;
      nextY = event.clientY;
      presence.set(1);
      window.clearTimeout(idleId);
      idleId = window.setTimeout(() => presence.set(0), 1800);
      if (frameId === 0) frameId = window.requestAnimationFrame(commit);
    };
    const handleOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      hover.set(target?.closest('a, button, [role="button"]') ? 1 : 0);
    };
    const handleLeave = () => presence.set(0);

    window.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('pointerover', handleOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', handleLeave);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerover', handleOver);
      document.documentElement.removeEventListener('pointerleave', handleLeave);
      window.clearTimeout(idleId);
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
    };
  }, [hover, pointerX, pointerY, presence, reduceMotion]);

  // The footer is measured for tone only; chapters run hero (00) .. contact (08).
  const total = Math.min(count, CHAPTER_COUNT + 1);
  const active = Math.min(activeIndex, CHAPTER_COUNT);
  const segments = Array.from({ length: total }, (_, index) => index);

  return (
    <>
      <div className={styles.stories} data-tone={tone} aria-hidden="true">
        {segments.map((index) => (
          <span
            key={index}
            className={styles.segment}
            data-state={index < active ? 'done' : index === active ? 'active' : 'idle'}
          >
            {index === active ? (
              <motion.i style={{ scaleX: reduceMotion ? progress : fill }} />
            ) : null}
          </span>
        ))}
      </div>

      <div className={styles.atmosphere} data-tone={tone} aria-hidden="true">
        <span className={styles.leftRule} />
        <span className={styles.rightRule} />
        {!reduceMotion ? (
          <motion.span
            className={styles.pointerTrace}
            style={{ x: traceX, y: traceY, scale: traceScale, opacity: traceOpacity }}
          />
        ) : null}
        {count > 0 ? (
          <div className={styles.folio}>
            <span className={styles.folioLabel}>{content.ui.chapter}</span>
            <span className={styles.folioNumber}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.b
                  key={active}
                  initial={reduceMotion ? false : { y: '110%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduceMotion ? undefined : { y: '-110%', opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {pad(active)}
                </motion.b>
              </AnimatePresence>
            </span>
            <i />
            <span className={styles.folioTotal}>{pad(CHAPTER_COUNT)}</span>
          </div>
        ) : null}
      </div>
    </>
  );
}
