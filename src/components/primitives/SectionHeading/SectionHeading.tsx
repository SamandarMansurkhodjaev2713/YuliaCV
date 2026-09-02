import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import type { SectionId } from '../../../content/types';
import { chapterLabel } from '../../../lib/sections';
import { MaskText } from '../../motion/MaskText/MaskText';
import { Reveal } from '../../motion/Reveal/Reveal';
import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  readonly section: SectionId;
  readonly eyebrow: string;
  readonly title: string;
  readonly description?: string;
  readonly inverse?: boolean;
  readonly titleId: string;
  /** Hide the large chapter numeral when the section brings its own background motif. */
  readonly numeral?: boolean;
}

export function SectionHeading({
  section,
  eyebrow,
  title,
  description,
  inverse = false,
  titleId,
  numeral = true,
}: SectionHeadingProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ['start end', 'end start'] });
  const numeralY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [48, -64]);
  const number = chapterLabel(section);
  const classes = inverse ? `${styles.root} ${styles.inverse}` : styles.root;

  return (
    <div ref={rootRef} className={classes}>
      {numeral ? (
        <motion.span className={styles.numeral} aria-hidden="true" style={{ y: numeralY }}>
          {number}
        </motion.span>
      ) : null}
      <div className={styles.topline}>
        <Reveal className={styles.eyebrow} y={8} amount={0.6}>
          <span>{number}</span> / {eyebrow}
        </Reveal>
        <motion.span
          className={styles.rule}
          initial={reduceMotion ? false : { scaleX: 0 }}
          whileInView={reduceMotion ? undefined : { scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <MaskText as="h2" className={styles.title} id={titleId}>
        {title}
      </MaskText>
      {description ? (
        <Reveal className={styles.description} delay={0.12}>
          <p>{description}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
