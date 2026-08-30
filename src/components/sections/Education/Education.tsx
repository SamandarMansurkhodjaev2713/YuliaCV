import { motion, useReducedMotion } from 'motion/react';
import { siteContent } from '../../../content/site';
import { Container } from '../../primitives/Container/Container';
import { SectionHeading } from '../../primitives/SectionHeading/SectionHeading';
import styles from './Education.module.css';

export function Education() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="education" className={styles.section} aria-labelledby="education-title">
      <Container>
        <SectionHeading
          eyebrow={siteContent.education.eyebrow}
          title={siteContent.education.title}
          id="education-title"
        />

        <div className={styles.timeline}>
          {siteContent.education.items.map((item, index) => (
            <motion.article
              key={`${item.year}-${item.title}`}
              className={styles.item}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.55 }}
              transition={{ duration: 0.56, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.span
                className={styles.rule}
                initial={reduceMotion ? false : { scaleX: 0 }}
                whileInView={reduceMotion ? undefined : { scaleX: 1 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.72, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
              />
              <time>{item.year}</time>
              <div>
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
