import { motion, useReducedMotion } from 'motion/react';
import { useMobileContactBar } from '../../../hooks/useMobileContactBar';
import { useLocale } from '../../../i18n/useLocale';
import { Reveal } from '../../motion/Reveal/Reveal';
import { ArrowIcon } from '../../primitives/ArrowIcon/ArrowIcon';
import { Button } from '../../primitives/Button/Button';
import { Container } from '../../primitives/Container/Container';
import { SectionHeading } from '../../primitives/SectionHeading/SectionHeading';
import styles from './Contact.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

export function MobileContactBar() {
  const { content } = useLocale();
  const isVisible = useMobileContactBar();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={styles.mobileBar}
      aria-hidden={!isVisible}
      initial={false}
      animate={{ y: isVisible ? 0 : '140%', opacity: isVisible ? 1 : 0 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.42, ease: EASE }}
    >
      <a
        href={content.contacts.telegram}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={isVisible ? 0 : -1}
        aria-label={content.ui.telegramAria}
      >
        <span>{content.ui.mobileBarCta}</span>
        <ArrowIcon />
      </a>
    </motion.div>
  );
}

export function Contact() {
  const { content } = useLocale();

  return (
    <section
      id="contact"
      className={styles.section}
      aria-labelledby="contact-title"
      data-chapter="contact"
      data-tone="dark"
    >
      <Container className={styles.inner}>
        <SectionHeading
          section="contact"
          inverse
          eyebrow={content.contact.eyebrow}
          title={content.contact.title}
          titleId="contact-title"
        />

        <div className={styles.body}>
          <Reveal className={styles.description} delay={0.08}>
            <p>{content.contact.description}</p>
          </Reveal>

          <Reveal className={styles.actions} delay={0.16}>
            <Button
              href={content.contacts.telegram}
              tone="paper"
              size="lg"
              external
              aria-label={content.ui.telegramAria}
            >
              {content.contact.telegramLabel}
            </Button>
            <div className={styles.secondary}>
              <Button href={`mailto:${content.contacts.email}`} variant="link" tone="paper" aria-label={content.ui.emailAria}>
                {content.contact.emailLabel}
              </Button>
              <Button href={content.contacts.cv} variant="link" tone="paper" external aria-label={content.ui.cvAria}>
                {content.ui.cvLabel}
              </Button>
            </div>
          </Reveal>

          <Reveal className={styles.meta} delay={0.22} y={8}>
            <span>{content.contact.note}</span>
            <span>
              {content.contacts.telegramHandle} · {content.contacts.email}
            </span>
          </Reveal>
        </div>

        <span className={styles.caption} aria-hidden="true">
          {content.contact.indexCaption}
        </span>
      </Container>
    </section>
  );
}
