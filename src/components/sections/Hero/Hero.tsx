import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import portraitUrl from '../../../assets/images/yulia-portrait.webp';
import { siteContent } from '../../../content/site';
import { MaskText } from '../../motion/MaskText/MaskText';
import { Reveal } from '../../motion/Reveal/Reveal';
import { ArrowIcon } from '../../primitives/ArrowIcon/ArrowIcon';
import { Container } from '../../primitives/Container/Container';
import styles from './Hero.module.css';

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 12]);
  const stripX = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -6]);
  const fieldY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -28]);
  const fieldX = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 18]);

  return (
    <section ref={rootRef} id="hero" className={styles.hero} aria-labelledby="hero-title">
      <motion.div className={styles.field} aria-hidden="true" style={{ x: fieldX, y: fieldY }}>
        <span className={styles.fieldHalo} />
        <span className={styles.fieldDisc} />
        <span className={styles.fieldRule} />
        <span className={styles.fieldType}>СМЫСЛ → СИСТЕМА</span>
      </motion.div>
      <Container className={styles.grid}>
        <div className={styles.copy}>
          <Reveal className={styles.eyebrow} y={10}>
            <p>{siteContent.hero.eyebrow}</p>
          </Reveal>

          <h1 id="hero-title" className={styles.title}>
            <MaskText as="span">{siteContent.hero.titleFirst}</MaskText>
            <MaskText as="span" delay={0.07}>
              {siteContent.hero.titleSecond}
            </MaskText>
          </h1>

          <Reveal className={styles.description} delay={0.14}>
            <p>{siteContent.hero.description}</p>
          </Reveal>

          <Reveal className={styles.actions} delay={0.2}>
            <a
              className={styles.primary}
              href={siteContent.contacts.telegram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написать в Telegram Юлии, откроется в новой вкладке"
            >
              <span>{siteContent.hero.primaryCta}</span>
              <ArrowIcon />
            </a>
            <a className={styles.secondary} href="#case">
              {siteContent.hero.secondaryCta}
              <span aria-hidden="true">↓</span>
            </a>
          </Reveal>

          <Reveal className={styles.meta} delay={0.26}>
            <span>00 / PORTFOLIO</span>
            <span>{siteContent.hero.location}</span>
          </Reveal>

          <Reveal className={styles.proof} delay={0.31} y={12}>
            <span>РАБОЧАЯ РАМКА</span>
            <p>Бренд / аудитория / контент / следующее действие</p>
          </Reveal>
        </div>

        <motion.div
          className={styles.portraitArea}
          initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.985 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.72, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.portraitFrame}>
            <motion.img
              src={portraitUrl}
              alt="Юлия Брынских, SMM-специалист"
              width="960"
              height="1200"
              fetchPriority="high"
              style={{ y: imageY }}
              initial={reduceMotion ? false : { scale: 1.09 }}
              animate={reduceMotion ? undefined : { scale: 1.06 }}
              transition={{ duration: 1.05, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className={styles.imageIndex} aria-hidden="true">
              <span>Y.B.</span>
              <span>01</span>
            </div>
          </div>
          <div className={styles.portraitCaption}>
            <span>ПОЗИЦИОНИРОВАНИЕ</span>
            <span>ГОЛОС БРЕНДА</span>
            <span>КОНТЕНТ-СИСТЕМА</span>
          </div>
          <span className={styles.verticalWord} aria-hidden="true">
            SMM
          </span>
        </motion.div>

        <motion.div className={styles.competenceStrip} style={{ x: stripX }} aria-hidden="true">
          <span>БРЕНД</span>
          <i />
          <span>АУДИТОРИЯ</span>
          <i />
          <span>КОНТЕНТ</span>
          <i />
          <span>ДЕЙСТВИЕ</span>
        </motion.div>
      </Container>
    </section>
  );
}
