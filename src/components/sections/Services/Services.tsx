import { motion, useReducedMotion } from 'motion/react';
import { useLocale } from '../../../i18n/useLocale';
import { pad } from '../../../lib/sections';
import { Reveal } from '../../motion/Reveal/Reveal';
import { ArrowIcon } from '../../primitives/ArrowIcon/ArrowIcon';
import { Container } from '../../primitives/Container/Container';
import { SectionHeading } from '../../primitives/SectionHeading/SectionHeading';
import styles from './Services.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

export function Services() {
  const { content } = useLocale();
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="services"
      className={styles.section}
      aria-labelledby="services-title"
      data-chapter="services"
      data-tone="light"
    >
      <Container>
        <SectionHeading
          section="services"
          eyebrow={content.services.eyebrow}
          title={content.services.title}
          description={content.services.description}
          titleId="services-title"
        />

        <div className={styles.list}>
          {content.services.items.map((item, index) => (
            <motion.article
              key={item.title}
              className={styles.item}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.58, delay: (index % 2) * 0.08, ease: EASE }}
            >
              <span className={styles.number}>{pad(index + 1)}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ArrowIcon className={styles.arrow} />
            </motion.article>
          ))}
        </div>

        <Reveal className={styles.footnote}>
          <span>{content.services.footnoteLabel}</span>
          <p>{content.services.footnote}</p>
        </Reveal>
      </Container>
    </section>
  );
}
