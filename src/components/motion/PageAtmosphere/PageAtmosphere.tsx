import { motion, useMotionValue, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { useEffect } from 'react';
import styles from './PageAtmosphere.module.css';

export function PageAtmosphere() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.25 });
  const pointerX = useMotionValue(-80);
  const pointerY = useMotionValue(-80);
  const traceX = useSpring(pointerX, { stiffness: 170, damping: 26, mass: 0.22 });
  const traceY = useSpring(pointerY, { stiffness: 170, damping: 26, mass: 0.22 });

  useEffect(() => {
    if (reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    let frameId = 0;
    let nextX = -80;
    let nextY = -80;
    const commit = () => {
      frameId = 0;
      pointerX.set(nextX);
      pointerY.set(nextY);
    };
    const handlePointer = (event: PointerEvent) => {
      nextX = event.clientX;
      nextY = event.clientY;
      if (frameId === 0) frameId = window.requestAnimationFrame(commit);
    };

    window.addEventListener('pointermove', handlePointer, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointer);
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
    };
  }, [pointerX, pointerY, reduceMotion]);

  return (
    <div className={styles.atmosphere} aria-hidden="true">
      <motion.span className={styles.progress} style={{ scaleX: progress }} />
      <span className={styles.leftRule} />
      <span className={styles.rightRule} />
      {!reduceMotion ? (
        <motion.span className={styles.pointerTrace} style={{ x: traceX, y: traceY }} />
      ) : null}
      <div className={styles.rail}>
        <span>YB / SMM</span>
        <i />
        <span>SCROLL / 07</span>
      </div>
    </div>
  );
}
