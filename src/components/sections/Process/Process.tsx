import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { useLocale } from '../../../i18n/useLocale';
import { pad } from '../../../lib/sections';
import { Container } from '../../primitives/Container/Container';
import { SectionHeading } from '../../primitives/SectionHeading/SectionHeading';
import styles from './Process.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

export function Process() {
  const { content } = useLocale();
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ['start 78%', 'end 62%'] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="process"
      className={styles.section}
      aria-labelledby="process-title"
      data-chapter="process"
      data-tone="light"
    >
      <Container>
        <SectionHeading
          section="process"
          eyebrow={content.process.eyebrow}
          title={content.process.title}
          description={content.process.description}
          titleId="process-title"
        />

        <div ref={rootRef} className={styles.timeline}>
          <span className={styles.baseLine} aria-hidden="true" />
          <motion.span
            className={styles.progressLine}
            aria-hidden="true"
            style={{ scaleY: reduceMotion ? 1 : lineScale }}
          />

          {content.process.items.map((item, index) => (
            <motion.article
              key={item.title}
              className={`${styles.step} ${index % 2 === 0 ? styles.left : styles.right}`}
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.62, delay: 0.05, ease: EASE }}
            >
              <span className={styles.dot} aria-hidden="true" />
              <div className={styles.stepCopy}>
                <span>{pad(index + 1)}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
