import { motion, useReducedMotion } from 'motion/react';
import { siteContent } from '../../../content/site';
import { useMobileContactBar } from '../../../hooks/useMobileContactBar';
import { MaskText } from '../../motion/MaskText/MaskText';
import { Reveal } from '../../motion/Reveal/Reveal';
import { ArrowIcon } from '../../primitives/ArrowIcon/ArrowIcon';
import { Container } from '../../primitives/Container/Container';
import styles from './Contact.module.css';

export function MobileContactBar() {
  const isVisible = useMobileContactBar();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={styles.mobileBar}
      aria-hidden={!isVisible}
      initial={false}
      animate={{ y: isVisible ? 0 : '130%', opacity: isVisible ? 1 : 0 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      <a
        href={siteContent.contacts.telegram}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={isVisible ? 0 : -1}
        aria-label="Написать в Telegram Юлии, откроется в новой вкладке"
      >
        Написать в Telegram <ArrowIcon />
      </a>
    </motion.div>
  );
}

export function Contact() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <motion.div
        className={styles.plane}
        aria-hidden="true"
        initial={reduceMotion ? false : { scaleY: 0 }}
        whileInView={reduceMotion ? undefined : { scaleY: 1 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
      <Container className={styles.inner}>
        <Reveal className={styles.eyebrow} y={10}>
          {siteContent.contact.eyebrow}
        </Reveal>

        <MaskText as="h2" className={styles.title} id="contact-title">
          {siteContent.contact.title}
        </MaskText>

        <Reveal className={styles.description} delay={0.1}>
          <p>{siteContent.contact.description}</p>
        </Reveal>

        <Reveal className={styles.actions} delay={0.17}>
          <a
            className={styles.telegram}
            href={siteContent.contacts.telegram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Написать в Telegram Юлии, откроется в новой вкладке"
          >
            <span>{siteContent.contact.telegramLabel}</span>
            <ArrowIcon />
          </a>

          {siteContent.contacts.instagram ? (
            <a
              className={styles.secondary}
              href={siteContent.contacts.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Открыть Instagram Юлии, откроется в новой вкладке"
            >
              {siteContent.contact.instagramLabel} <ArrowIcon />
            </a>
          ) : (
            <a
              className={styles.secondary}
              href={siteContent.contacts.cv}
              target="_blank"
              rel="noopener noreferrer"
            >
              Открыть CV <ArrowIcon />
            </a>
          )}
        </Reveal>

        <div className={styles.contactIndex} aria-hidden="true">
          <span>07</span>
          <span>LET'S TALK</span>
        </div>
      </Container>
    </section>
  );
}
