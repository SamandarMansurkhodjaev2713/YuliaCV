import { motion, useReducedMotion } from 'motion/react';
import { siteContent } from '../../../content/site';
import { Reveal } from '../../motion/Reveal/Reveal';
import { ArrowIcon } from '../../primitives/ArrowIcon/ArrowIcon';
import { Container } from '../../primitives/Container/Container';
import { SectionHeading } from '../../primitives/SectionHeading/SectionHeading';
import styles from './Services.module.css';

export function Services() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="services" className={styles.section} aria-labelledby="services-title">
      <Container>
        <SectionHeading
          eyebrow={siteContent.services.eyebrow}
          title={siteContent.services.title}
          description={siteContent.services.description}
          id="services-title"
        />

        <div className={styles.list}>
          {siteContent.services.items.map((item, index) => (
            <motion.article
              key={item.number}
              className={styles.item}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.55 }}
              transition={{ duration: 0.56, delay: index * 0.045, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.span
                className={styles.rule}
                initial={reduceMotion ? false : { scaleX: 0 }}
                whileInView={reduceMotion ? undefined : { scaleX: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.72, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
              />
              <span className={styles.number}>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ArrowIcon className={styles.arrow} />
            </motion.article>
          ))}
        </div>

        <Reveal className={styles.footnote}>
          <span>Не пакет ради пакета.</span>
          <p>Состав работы определяется задачей, продуктом и текущей точкой бренда.</p>
        </Reveal>
      </Container>
    </section>
  );
}
