import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import portraitUrl from '../../../assets/images/yulia-portrait.webp';
import { useLocale } from '../../../i18n/useLocale';
import { useIntroGate } from '../../motion/IntroGate/useIntroGate';
import { Button } from '../../primitives/Button/Button';
import { Container } from '../../primitives/Container/Container';
import styles from './Hero.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

interface EntranceProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly ready: boolean;
  readonly still: boolean;
  readonly delay?: number;
  readonly y?: number;
}

/** Fade-up that waits for the intro handoff instead of the viewport. */
function Entrance({ children, className, ready, still, delay = 0, y = 18 }: EntranceProps) {
  if (still) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.72, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const { content } = useLocale();
  const { introActive } = useIntroGate();
  const reduceMotion = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLElement>(null);
  /* Whether this mount started under the intro: the title then lands from the overlay
     instead of playing its own mask reveal. */
  const [handoff] = useState(introActive);
  const ready = !introActive;

  const { scrollYProgress } = useScroll({ target: rootRef, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 40]);
  const fieldY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -90]);
  const stripX = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -24]);

  const titleLine = (key: 'first' | 'second', text: string, delay: number) => {
    if (reduceMotion) {
      return (
        <span className={styles.titleLine}>
          <span className={styles.titleInner} data-hero-line={key}>
            {text}
          </span>
        </span>
      );
    }
    if (handoff) {
      return (
        <span className={styles.titleLine}>
          <motion.span
            className={styles.titleInner}
            data-hero-line={key}
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 0 }}
          >
            {text}
          </motion.span>
        </span>
      );
    }
    return (
      <span className={styles.titleLine}>
        <motion.span
          className={styles.titleInner}
          data-hero-line={key}
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          transition={{ duration: 0.82, delay, ease: EASE }}
        >
          {text}
        </motion.span>
      </span>
    );
  };

  return (
    <section
      ref={rootRef}
      id="hero"
      className={styles.hero}
      aria-labelledby="hero-title"
      data-chapter="hero"
      data-tone="light"
    >
      <motion.div className={styles.field} aria-hidden="true" style={{ y: fieldY }}>
        <span className={styles.ring} />
        <span className={styles.arc} />
        <span className={styles.fieldRule} />
      </motion.div>

      <Container className={styles.grid}>
        <div className={styles.copyTop}>
          <Entrance className={styles.eyebrow} ready={ready} still={reduceMotion} y={10}>
            <p>{content.hero.eyebrow}</p>
          </Entrance>
          <h1 id="hero-title" className={styles.title}>
            {titleLine('first', content.hero.titleFirst, 0.05)}
            {titleLine('second', content.hero.titleSecond, 0.13)}
          </h1>
        </div>

        <motion.div
          className={styles.portraitArea}
          initial={reduceMotion ? false : { opacity: 0, y: 26 }}
          animate={reduceMotion ? undefined : ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
          transition={{ duration: 0.9, delay: 0.16, ease: EASE }}
        >
          <div className={styles.portraitFrame}>
            <motion.img
              src={portraitUrl}
              alt={content.hero.portraitAlt}
              width="720"
              height="1080"
              fetchPriority="high"
              style={{ y: imageY }}
              initial={reduceMotion ? false : { scale: 1.08 }}
              animate={reduceMotion ? undefined : ready ? { scale: 1 } : { scale: 1.08 }}
              transition={{ duration: 1.3, delay: 0.16, ease: EASE }}
            />
            <div className={styles.imageIndex} aria-hidden="true">
              <span>Y.B.</span>
              <span>01</span>
            </div>
          </div>
        </motion.div>

        <div className={styles.copyBottom}>
          <Entrance className={styles.description} ready={ready} still={reduceMotion} delay={0.18}>
            <p>{content.hero.description}</p>
          </Entrance>

          <Entrance className={styles.actions} ready={ready} still={reduceMotion} delay={0.26}>
            <Button href={content.contacts.telegram} external aria-label={content.ui.telegramAria}>
              {content.hero.primaryCta}
            </Button>
            <Button href="#case" variant="link" icon="down">
              {content.hero.secondaryCta}
            </Button>
          </Entrance>

          <Entrance className={styles.availability} ready={ready} still={reduceMotion} delay={0.34} y={10}>
            <i aria-hidden="true" />
            <span>{content.hero.location}</span>
          </Entrance>

          <Entrance className={styles.facts} ready={ready} still={reduceMotion} delay={0.4} y={12}>
            {content.hero.facts.map((fact) => (
              <div key={fact.label}>
                <strong>{fact.value}</strong>
                <span>{fact.label}</span>
              </div>
            ))}
          </Entrance>
        </div>

        <motion.div className={styles.strip} style={{ x: stripX }} aria-hidden="true">
          {content.hero.strip.map((word, index) => (
            <motion.span
              key={word}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={reduceMotion ? undefined : ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.08, ease: EASE }}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
