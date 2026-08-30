import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { siteContent } from '../../../content/site';
import type { CaseStep } from '../../../content/types';
import { Container } from '../../primitives/Container/Container';
import { SectionHeading } from '../../primitives/SectionHeading/SectionHeading';
import styles from './CaseStudy.module.css';

interface CaseMediaProps {
  readonly step: CaseStep;
  readonly animated?: boolean;
}

function PackagingMedia() {
  return (
    <div className={styles.packagingVisual}>
      <div className={styles.phone}>
        <div className={styles.phoneTop}>
          <span>UNNI</span>
          <i />
        </div>
        <div className={styles.profileRow}>
          <span className={styles.avatar}>U</span>
          <div>
            <strong>unni.beauty</strong>
            <small>K-beauty care</small>
          </div>
        </div>
        <div className={styles.highlights}>
          {['УХОД', 'ОТЗЫВЫ', 'ЦЕНЫ', 'ДОСТАВКА'].map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <div className={styles.feedGrid}>
          <span className={styles.feedText}>КАК ВЫБРАТЬ УХОД</span>
          <span />
          <span className={styles.feedProduct}>01</span>
          <span />
          <span className={styles.feedText}>SKIN NOTES</span>
          <span className={styles.feedProduct}>02</span>
        </div>
      </div>
      <p className={styles.sideCaption}>PROFILE / HIGHLIGHTS / VISUAL</p>
    </div>
  );
}

function VoiceMedia() {
  return (
    <div className={styles.voiceVisual}>
      <p className={styles.mediaKicker}>TONE OF VOICE / UNNI</p>
      <p className={styles.voiceQuote}>«Заботливая старшая сестра»</p>
      <div className={styles.voiceRules}>
        <span>ТЕПЛО</span>
        <span>ПОНЯТНО</span>
        <span>БЕЗ ДАВЛЕНИЯ</span>
        <span>С УЧЁТОМ КОНТЕКСТА</span>
      </div>
      <p className={styles.voiceFootnote}>Помочь с выбором — раньше, чем предложить покупку.</p>
    </div>
  );
}

function FunnelMedia() {
  const labels = ['ПОЛЕЗНЫЙ REELS', 'ПРОФИЛЬ', 'HIGHLIGHTS', 'DIRECT', 'ЗАКАЗ'];
  return (
    <div className={styles.funnelVisual}>
      <p className={styles.mediaKicker}>USER PATH / 05 TOUCHPOINTS</p>
      <div className={styles.funnelPath}>
        {labels.map((label, index) => (
          <div key={label} className={styles.funnelNode}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{label}</strong>
          </div>
        ))}
      </div>
      <p className={styles.funnelNote}>Контент не заканчивается просмотром — он подсказывает следующий шаг.</p>
    </div>
  );
}

function CreatorsMedia() {
  return (
    <div className={styles.creatorsVisual}>
      <p className={styles.mediaKicker}>CREATOR SELECTION / BRIEF</p>
      <div className={styles.creatorSheet}>
        <div className={styles.sheetHead}>
          <strong>UNNI / CREATOR FIT</strong>
          <span>04</span>
        </div>
        {[
          ['Ниша', 'K-beauty / уход'],
          ['Аудитория', 'релевантность'],
          ['Проверка', 'аномалии / накрутки'],
          ['Формат', 'нативная интеграция'],
          ['ТЗ', 'смысл / кадр / CTA'],
        ].map(([term, value]) => (
          <div key={term} className={styles.sheetRow}>
            <span>{term}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <span className={styles.stamp}>CHECKED FOR FIT</span>
    </div>
  );
}

function StrategyMedia() {
  return (
    <div className={styles.strategyVisual}>
      <p className={styles.mediaKicker}>STRATEGY BASE / LOCAL CONTEXT</p>
      <div className={styles.strategyGrid}>
        <div>
          <span>01</span>
          <strong>SWOT</strong>
          <small>сильные стороны / риски</small>
        </div>
        <div>
          <span>02</span>
          <strong>TOWS</strong>
          <small>связь анализа и действий</small>
        </div>
        <div>
          <span>03</span>
          <strong>4P</strong>
          <small>продукт / цена / место / продвижение</small>
        </div>
        <div>
          <span>04</span>
          <strong>USP</strong>
          <small>понятное отличие бренда</small>
        </div>
      </div>
      <p className={styles.strategyFootnote}>Визуал получает опору в бизнес-контексте.</p>
    </div>
  );
}

function MediaContent({ id }: { readonly id: CaseStep['id'] }) {
  switch (id) {
    case 'packaging':
      return <PackagingMedia />;
    case 'voice':
      return <VoiceMedia />;
    case 'funnel':
      return <FunnelMedia />;
    case 'creators':
      return <CreatorsMedia />;
    case 'strategy':
      return <StrategyMedia />;
  }
}

function CaseMedia({ step, animated = false }: CaseMediaProps) {
  const reduceMotion = useReducedMotion();
  const content = (
    <div className={styles.mediaSurface}>
      <div className={styles.mediaTopline}>
        <span>UNNI / SELECTED PROJECT</span>
        <span>{step.number}</span>
      </div>
      <MediaContent id={step.id} />
      <div className={styles.mediaBottomline}>
        <span>{step.label}</span>
        <span>Y.B. / 2026</span>
      </div>
    </div>
  );

  if (!animated || reduceMotion) return content;

  return (
    <motion.div
      className={styles.mediaMotion}
      initial={{ opacity: 0, y: 14, scale: 0.992 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.996 }}
      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
    >
      {content}
    </motion.div>
  );
}

export function CaseStudy() {
  const firstStep = siteContent.caseStudy.steps.at(0);
  const [activeId, setActiveId] = useState<CaseStep['id']>(firstStep?.id ?? 'packaging');
  const stepRefs = useRef<Array<HTMLElement | null>>([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const nodes = stepRefs.current.filter((node): node is HTMLElement => node !== null);
    if (nodes.length === 0 || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = visible?.target.getAttribute('data-step-id');
        const matchingStep = siteContent.caseStudy.steps.find((step) => step.id === id);
        if (matchingStep) setActiveId(matchingStep.id);
      },
      { rootMargin: '-26% 0px -45% 0px', threshold: [0.05, 0.2, 0.45, 0.7] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const activeStep = siteContent.caseStudy.steps.find((step) => step.id === activeId) ?? firstStep;
  if (!activeStep) return null;

  return (
    <section id="case" className={styles.section} aria-labelledby="case-title">
      <Container>
        <SectionHeading
          inverse
          eyebrow={siteContent.caseStudy.eyebrow}
          title={siteContent.caseStudy.title}
          description={siteContent.caseStudy.summary}
          id="case-title"
        />

        <div className={styles.caseMeta}>
          <motion.span
            initial={reduceMotion ? false : { scaleX: 0 }}
            whileInView={reduceMotion ? undefined : { scaleX: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          <p>{siteContent.caseStudy.disclaimer}</p>
        </div>

        <div className={styles.layout}>
          <div className={styles.desktopMedia}>
            <AnimatePresence mode="wait" initial={false}>
              <CaseMedia key={activeStep.id} step={activeStep} animated />
            </AnimatePresence>
          </div>

          <div className={styles.steps}>
            {siteContent.caseStudy.steps.map((step, index) => {
              const isActive = step.id === activeId;
              return (
                <article
                  key={step.id}
                  ref={(node) => {
                    stepRefs.current[index] = node;
                  }}
                  className={`${styles.step} ${isActive ? styles.activeStep : ''}`}
                  data-step-id={step.id}
                >
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className={styles.stepTopline}>
                      <span>{step.number}</span>
                      <small>{step.label}</small>
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </motion.div>
                  <div className={styles.mobileMedia}>
                    <CaseMedia step={step} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
