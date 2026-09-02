import { motion, useReducedMotion } from 'motion/react';
import { useLocale } from '../../../i18n/useLocale';
import { Container } from '../../primitives/Container/Container';
import { SectionHeading } from '../../primitives/SectionHeading/SectionHeading';
import styles from './Education.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

export function Education() {
  const { content } = useLocale();
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="education"
      className={styles.section}
      aria-labelledby="education-title"
      data-chapter="education"
      data-tone="light"
    >
      <Container>
        <SectionHeading
          section="education"
          eyebrow={content.education.eyebrow}
          title={content.education.title}
          titleId="education-title"
        />

        <div className={styles.timeline}>
          {content.education.items.map((item, index) => (
            <motion.article
              key={`${item.year}-${item.title}`}
              className={styles.item}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: index * 0.06, ease: EASE }}
            >
              <div className={styles.top}>
                <time>{item.year}</time>
                <em>{item.kind}</em>
              </div>
              <div className={styles.copy}>
                <h3>{item.title}</h3>
                <strong>{item.provider}</strong>
              </div>
              <p>{item.description}</p>
              <span className={styles.dot} aria-hidden="true" />
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
