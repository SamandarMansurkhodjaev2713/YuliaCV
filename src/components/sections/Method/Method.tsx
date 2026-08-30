import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { siteContent } from '../../../content/site';
import type { MethodItem } from '../../../content/types';
import { Container } from '../../primitives/Container/Container';
import { SectionHeading } from '../../primitives/SectionHeading/SectionHeading';
import styles from './Method.module.css';

function MethodVisual({ item }: { readonly item: MethodItem }) {
  return (
    <motion.div
      key={item.id}
      className={`${styles.visualInner} ${styles[item.id]}`}
      initial={{ opacity: 0, y: 12, scale: 0.994 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -7, scale: 0.998 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {item.id === 'voice' ? (
        <>
          <p className={styles.visualIndex}>VOICE / 01</p>
          <strong>Тепло.</strong>
          <strong>Ясно.</strong>
          <strong>По делу.</strong>
          <p className={styles.visualNote}>Характер слышно ещё до того, как человек запомнил название.</p>
        </>
      ) : null}

      {item.id === 'system' ? (
        <>
          <p className={styles.visualIndex}>SYSTEM / 02</p>
          <div className={styles.systemGrid}>
            <span>REELS</span>
            <span>STORIES</span>
            <span>PROFILE</span>
            <span>HIGHLIGHTS</span>
            <span>PLAN</span>
            <span>TOV</span>
          </div>
          <p className={styles.visualNote}>Разные форматы. Одна логика.</p>
        </>
      ) : null}

      {item.id === 'action' ? (
        <>
          <p className={styles.visualIndex}>ACTION / 03</p>
          <div className={styles.actionFlow}>
            {['КОНТЕНТ', 'ПРОФИЛЬ', 'DIRECT', 'ДЕЙСТВИЕ'].map((label, index) => (
              <div key={label}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{label}</strong>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </motion.div>
  );
}

export function Method() {
  const [activeId, setActiveId] = useState<MethodItem['id']>('voice');
  const reduceMotion = useReducedMotion();
  const activeItem = siteContent.method.items.find((item) => item.id === activeId) ?? siteContent.method.items[0];

  return (
    <section id="approach" className={styles.section} aria-labelledby="method-title">
      <Container>
        <SectionHeading
          eyebrow={siteContent.method.eyebrow}
          title={siteContent.method.title}
          description={siteContent.method.description}
          id="method-title"
        />

        <div className={styles.layout}>
          <div className={styles.list}>
            {siteContent.method.items.map((item, index) => {
              const isActive = item.id === activeId;
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  className={`${styles.item} ${isActive ? styles.active : ''}`}
                  aria-pressed={isActive}
                  onPointerEnter={(event) => {
                    if (event.pointerType === 'mouse') setActiveId(item.id);
                  }}
                  onFocus={() => setActiveId(item.id)}
                  onClick={() => setActiveId(item.id)}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.45 }}
                  transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.span
                    className={styles.line}
                    initial={reduceMotion ? false : { scaleX: 0 }}
                    whileInView={reduceMotion ? undefined : { scaleX: 1 }}
                    viewport={{ once: true, amount: 0.7 }}
                    transition={{ duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <span className={styles.number}>{item.number}</span>
                  <span className={styles.itemCopy}>
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                    <small>{item.note}</small>
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className={styles.visual} aria-hidden="true">
            <AnimatePresence mode="wait" initial={false}>
              {activeItem ? <MethodVisual item={activeItem} /> : null}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
