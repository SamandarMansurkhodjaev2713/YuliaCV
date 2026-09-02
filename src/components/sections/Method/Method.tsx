import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import type { MethodItem } from '../../../content/types';
import { useLocale } from '../../../i18n/useLocale';
import { pad } from '../../../lib/sections';
import { Container } from '../../primitives/Container/Container';
import { SectionHeading } from '../../primitives/SectionHeading/SectionHeading';
import styles from './Method.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

function MethodVisual({ item }: { readonly item: MethodItem }) {
  const { lines } = item.visual;
  return (
    <motion.div
      key={item.id}
      className={`${styles.visualInner} ${styles[item.id]}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.36, ease: EASE }}
    >
      <p className={styles.visualIndex}>{item.visual.index}</p>
      {item.id === 'voice' ? (
        <div className={styles.voiceLines}>
          {lines.map((line) => (
            <strong key={line}>{line}</strong>
          ))}
        </div>
      ) : null}
      {item.id === 'system' ? (
        <div className={styles.systemGrid}>
          {lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      ) : null}
      {item.id === 'action' ? (
        <div className={styles.actionFlow}>
          {lines.map((line, index) => (
            <div key={line}>
              <span>{pad(index + 1)}</span>
              <strong>{line}</strong>
            </div>
          ))}
        </div>
      ) : null}
      <p className={styles.visualNote}>{item.visual.note}</p>
    </motion.div>
  );
}

export function Method() {
  const { content } = useLocale();
  const [activeId, setActiveId] = useState<MethodItem['id']>('voice');
  const reduceMotion = useReducedMotion();
  const activeItem = content.method.items.find((item) => item.id === activeId) ?? content.method.items[0];

  return (
    <section
      id="approach"
      className={styles.section}
      aria-labelledby="method-title"
      data-chapter="approach"
      data-tone="light"
    >
      <Container>
        <SectionHeading
          section="approach"
          eyebrow={content.method.eyebrow}
          title={content.method.title}
          description={content.method.description}
          titleId="method-title"
        />

        <div className={styles.layout}>
          <div className={styles.list}>
            {content.method.items.map((item, index) => {
              const isActive = item.id === activeId;
              return (
                <div key={item.id} className={styles.entry}>
                  <motion.button
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
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, delay: index * 0.07, ease: EASE }}
                  >
                    <motion.span
                      className={styles.line}
                      initial={reduceMotion ? false : { scaleX: 0 }}
                      whileInView={reduceMotion ? undefined : { scaleX: 1 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.8, delay: index * 0.06, ease: EASE }}
                    />
                    <span className={styles.number}>{pad(index + 1)}</span>
                    <span className={styles.itemCopy}>
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                      <small>{item.note}</small>
                    </span>
                    <span className={styles.chevron} aria-hidden="true" />
                  </motion.button>

                  <AnimatePresence initial={false}>
                    {isActive ? (
                      <motion.div
                        className={styles.mobileVisual}
                        aria-hidden="true"
                        initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.42, ease: EASE }}
                      >
                        <div className={styles.mobileVisualInner}>
                          <MethodVisual item={item} />
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className={styles.visual} aria-hidden="true">
            <span className={styles.corner} />
            <AnimatePresence mode="wait" initial={false}>
              {activeItem ? <MethodVisual item={activeItem} /> : null}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
