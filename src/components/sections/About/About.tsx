import { motion, useReducedMotion } from 'motion/react';
import detailUrl from '../../../assets/images/yulia-working-detail.webp';
import { siteContent } from '../../../content/site';
import { MaskText } from '../../motion/MaskText/MaskText';
import { Reveal } from '../../motion/Reveal/Reveal';
import { ArrowIcon } from '../../primitives/ArrowIcon/ArrowIcon';
import { Container } from '../../primitives/Container/Container';
import styles from './About.module.css';

export function About() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <Container>
        <div className={styles.topline}>
          <Reveal className={styles.eyebrow} y={10}>
            {siteContent.about.eyebrow}
          </Reveal>
          <motion.span
            initial={reduceMotion ? false : { scaleX: 0 }}
            whileInView={reduceMotion ? undefined : { scaleX: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <div className={styles.grid}>
          <div className={styles.statement}>
            <MaskText as="h2" className={styles.title} id="about-title">
              {siteContent.about.title}
            </MaskText>
            <Reveal className={styles.quote} delay={0.08}>
              <blockquote>{siteContent.about.quote}</blockquote>
            </Reveal>
          </div>

          <div className={styles.story}>
            {siteContent.about.paragraphs.map((paragraph, index) => (
              <Reveal key={paragraph} delay={index * 0.06}>
                <p>{paragraph}</p>
              </Reveal>
            ))}

            <Reveal className={styles.facts} delay={0.12}>
              {siteContent.about.facts.map((fact, index) => (
                <div key={fact}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{fact}</strong>
                </div>
              ))}
            </Reveal>

            <Reveal className={styles.cvAction} delay={0.16}>
              <a href={siteContent.contacts.cv} target="_blank" rel="noopener noreferrer">
                Открыть CV <ArrowIcon />
              </a>
            </Reveal>
          </div>

          <motion.figure
            className={styles.imageBand}
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.99 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={detailUrl} alt="Рабочий портрет Юлии" width="1200" height="700" loading="lazy" />
            <figcaption>
              <span>CLIENT SERVICE → MARKETING</span>
              <span>Y.B.</span>
            </figcaption>
          </motion.figure>
        </div>
      </Container>
    </section>
  );
}
