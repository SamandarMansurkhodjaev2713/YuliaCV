import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import type { CaseStep, SiteContent } from '../../../content/types';
import { useLocale } from '../../../i18n/useLocale';
import { pad } from '../../../lib/sections';
import { Container } from '../../primitives/Container/Container';
import { SectionHeading } from '../../primitives/SectionHeading/SectionHeading';
import styles from './CaseStudy.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

interface MediaProps {
  readonly step: CaseStep;
  readonly caseStudy: SiteContent['caseStudy'];
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
            <span>{pad(index + 1)}</span>
            <strong>{label}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function CreatorsMedia() {
  const rows: ReadonlyArray<readonly [string, string]> = [
    ['Ниша', 'K-beauty / уход'],
    ['Аудитория', 'релевантность'],
    ['Проверка', 'аномалии / накрутки'],
    ['Формат', 'нативная интеграция'],
    ['ТЗ', 'смысл / кадр / CTA'],
  ];
  return (
    <div className={styles.creatorsVisual}>
      <p className={styles.mediaKicker}>CREATOR SELECTION / BRIEF</p>
      <div className={styles.creatorSheet}>
        <div className={styles.sheetHead}>
          <strong>UNNI / CREATOR FIT</strong>
          <span>04</span>
        </div>
        {rows.map(([term, value]) => (
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
  const cells: ReadonlyArray<readonly [string, string]> = [
    ['SWOT', 'сильные стороны / риски'],
    ['TOWS', 'связь анализа и действий'],
    ['4P', 'продукт / цена / место / продвижение'],
    ['USP', 'понятное отличие бренда'],
  ];
  return (
    <div className={styles.strategyVisual}>
      <p className={styles.mediaKicker}>STRATEGY BASE / LOCAL CONTEXT</p>
      <div className={styles.strategyGrid}>
        {cells.map(([title, note], index) => (
          <div key={title}>
            <span>{pad(index + 1)}</span>
            <strong>{title}</strong>
            <small>{note}</small>
          </div>
        ))}
      </div>
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

function CaseMedia({ step, caseStudy, animated = false }: MediaProps) {
  const reduceMotion = useReducedMotion();
  const index = pad(caseStudy.steps.findIndex((item) => item.id === step.id) + 1);
  const content = (
    <div className={styles.mediaSurface}>
      <div className={styles.mediaTopline}>
        <span>{caseStudy.mediaProject}</span>
        <span>{index}</span>
      </div>
      <MediaContent id={step.id} />
      <div className={styles.mediaBottomline}>
        <span>{step.label}</span>
        <span>{caseStudy.mediaSignature}</span>
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
      transition={{ duration: 0.36, ease: EASE }}
    >
      {content}
    </motion.div>
  );
}

export function CaseStudy() {
  const { content } = useLocale();
  const { caseStudy } = content;
  const firstStep = caseStudy.steps[0];
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
        const matchingStep = caseStudy.steps.find((step) => step.id === id);
        if (matchingStep) setActiveId(matchingStep.id);
      },
      { rootMargin: '-28% 0px -42% 0px', threshold: [0.05, 0.2, 0.45, 0.7] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [caseStudy.steps]);

  const activeStep = caseStudy.steps.find((step) => step.id === activeId) ?? firstStep;
  if (!activeStep) return null;

  return (
    <section
      id="case"
      className={styles.section}
      aria-labelledby="case-title"
      data-chapter="case"
      data-tone="dark"
    >
      <Container>
        <SectionHeading
          section="case"
          inverse
          eyebrow={caseStudy.eyebrow}
          title={caseStudy.title}
          description={caseStudy.summary}
          titleId="case-title"
        />

        <div className={styles.caseMeta}>
          <motion.span
            initial={reduceMotion ? false : { scaleX: 0 }}
            whileInView={reduceMotion ? undefined : { scaleX: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: EASE }}
          />
          <p>{caseStudy.disclaimer}</p>
        </div>

        <div className={styles.layout}>
          <div className={styles.desktopMedia}>
            <AnimatePresence mode="wait" initial={false}>
              <CaseMedia key={activeStep.id} step={activeStep} caseStudy={caseStudy} animated />
            </AnimatePresence>
          </div>

          <div className={styles.steps}>
            {caseStudy.steps.map((step, index) => {
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
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.62, ease: EASE }}
                  >
                    <div className={styles.stepTopline}>
                      <span>{pad(index + 1)}</span>
                      <small>{step.label}</small>
                    </div>
                    <h3>{step.title}</h3>
                    <p className={styles.stepText}>{step.text}</p>
                  </motion.div>
                  <div className={styles.mobileMedia}>
                    <CaseMedia step={step} caseStudy={caseStudy} />
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
