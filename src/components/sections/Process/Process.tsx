import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { siteContent } from '../../../content/site';
import { Container } from '../../primitives/Container/Container';
import { SectionHeading } from '../../primitives/SectionHeading/SectionHeading';
import styles from './Process.module.css';

export function Process() {
  const rootRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ['start 75%', 'end 68%'],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={rootRef} id="process" className={styles.section} aria-labelledby="process-title">
      <Container>
        <SectionHeading
          eyebrow={siteContent.process.eyebrow}
          title={siteContent.process.title}
          description={siteContent.process.description}
          id="process-title"
        />

        <div className={styles.timeline}>
          <span className={styles.baseLine} aria-hidden="true" />
          <motion.span
            className={styles.progressLine}
            aria-hidden="true"
            style={{ scaleY: reduceMotion ? 1 : lineScale }}
          />

          {siteContent.process.items.map((item, index) => (
            <motion.article
              key={item.number}
              className={`${styles.step} ${index % 2 === 0 ? styles.left : styles.right}`}
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.58, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className={styles.dot} aria-hidden="true" />
              <div className={styles.stepCopy}>
                <span>{item.number}</span>
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
