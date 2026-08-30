import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import styles from './MaskText.module.css';

type MaskElement = 'div' | 'span' | 'h2';

interface MaskTextProps {
  readonly as?: MaskElement;
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
  readonly id?: string;
}

export function MaskText({ as = 'div', children, className, delay = 0, id }: MaskTextProps) {
  const reduceMotion = useReducedMotion();
  const classes = className ? `${styles.mask} ${className}` : styles.mask;
  const animatedContent = (
    <motion.span
      className={styles.inner}
      initial={reduceMotion ? false : { y: '108%' }}
      whileInView={reduceMotion ? undefined : { y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  );

  if (as === 'span') {
    return (
      <span className={classes} id={id}>
        {animatedContent}
      </span>
    );
  }
  if (as === 'h2') {
    return (
      <h2 className={classes} id={id}>
        {animatedContent}
      </h2>
    );
  }
  return (
    <div className={classes} id={id}>
      {animatedContent}
    </div>
  );
}
