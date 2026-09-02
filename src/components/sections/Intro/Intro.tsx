import { animate, motion, useMotionValue, useMotionValueEvent } from 'motion/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SiteContent } from '../../../content/types';
import { useLocale } from '../../../i18n/useLocale';
import { markIntroSeen } from '../../../lib/introSession';
import { pad } from '../../../lib/sections';
import { useIntroGate } from '../../motion/IntroGate/useIntroGate';
import { buildIntroLayout } from './introLayout';
import type { FragmentLayout, KeeperLayout } from './introLayout';
import styles from './Intro.module.css';

type Phase = 'noise' | 'system' | 'meaning' | 'handoff';

const SYSTEM_AT = 950;
const MEANING_AT = 1550;
const HANDOFF_AT = 2500;
const HANDOFF_MS = 640;
const SKIP_HANDOFF_MS = 420;
const OVERLAP_MS = 90;
const FONT_WAIT_MS = 900;
const EASE = [0.16, 1, 0.3, 1] as const;

interface LineTarget {
  readonly x: number;
  readonly y: number;
  readonly scale: number;
}

interface NameTargets {
  readonly first: LineTarget;
  readonly second: LineTarget;
}

const HIDDEN_CLIP = 'inset(0 0 100% 0)';
const VISIBLE_CLIP = 'inset(0 0 0% 0)';

function fragmentAnimation(phase: Phase, fragment: FragmentLayout) {
  switch (phase) {
    case 'noise':
      return {
        x: fragment.noiseDx,
        y: fragment.noiseDy,
        rotate: fragment.noiseRotate,
        opacity: fragment.noiseOpacity,
        scale: 1,
      };
    case 'system':
      return { x: 0, y: 0, rotate: 0, opacity: 0.55, scale: 1 };
    case 'meaning':
      return { x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.9 };
    case 'handoff':
      return { opacity: 0 };
  }
}

function fragmentTransition(phase: Phase, index: number) {
  switch (phase) {
    case 'noise':
      return { duration: 0.6, delay: index * 0.016, ease: EASE };
    case 'system':
      return { duration: 0.72, delay: index * 0.009, ease: EASE };
    case 'meaning':
      return { duration: 0.26, delay: index * 0.005, ease: 'easeOut' as const };
    case 'handoff':
      return { duration: 0.15 };
  }
}

function keeperAnimation(phase: Phase, keeper: KeeperLayout, viewport: { width: number; height: number }) {
  switch (phase) {
    case 'noise':
      return { opacity: 0, scale: 0.86, x: 0, y: 0 };
    case 'system':
      return { opacity: 1, scale: 1, x: 0, y: 0 };
    case 'meaning':
      return {
        opacity: 0,
        scale: 0.6,
        x: ((50 - keeper.gridX) / 100) * viewport.width,
        y: ((50 - keeper.gridY) / 100) * viewport.height,
      };
    case 'handoff':
      return { opacity: 0 };
  }
}

interface IntroOverlayProps {
  readonly content: SiteContent;
  readonly onFinish: () => void;
  readonly onUnmount: () => void;
}

function IntroOverlay({ content, onFinish, onUnmount }: IntroOverlayProps) {
  const [phase, setPhase] = useState<Phase>('noise');
  const [started, setStarted] = useState(false);
  const [targets, setTargets] = useState<NameTargets | null>(null);
  const [quickExit, setQuickExit] = useState(false);
  const phaseRef = useRef<Phase>('noise');
  const centerRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLSpanElement>(null);
  const secondRef = useRef<HTMLSpanElement>(null);
  const viewport = useMemo(() => ({ width: window.innerWidth, height: window.innerHeight }), []);
  const layout = useMemo(
    () => buildIntroLayout(content.intro.noise, content.intro.keepers, viewport),
    [content, viewport],
  );
  const count = useMotionValue(0);
  const [countLabel, setCountLabel] = useState('00');
  useMotionValueEvent(count, 'change', (value) => setCountLabel(pad(Math.round(value))));

  useEffect(() => {
    document.body.dataset.introActive = 'true';
    const shell = document.getElementById('app-shell');
    shell?.setAttribute('inert', '');
    shell?.setAttribute('aria-hidden', 'true');
    return () => {
      delete document.body.dataset.introActive;
      shell?.removeAttribute('inert');
      shell?.removeAttribute('aria-hidden');
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fonts =
      'fonts' in document
        ? Promise.all([document.fonts.load('400 1em Prata'), document.fonts.load('600 1em Onest')]).catch(
            () => undefined,
          )
        : Promise.resolve();
    const timeout = new Promise<void>((resolve) => window.setTimeout(resolve, FONT_WAIT_MS));
    void Promise.race([fonts, timeout]).then(() => {
      if (!cancelled) setStarted(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const goTo = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const beginHandoff = useCallback(
    (quick: boolean) => {
      if (phaseRef.current === 'handoff') return;
      const center = centerRef.current;
      const measure = (line: HTMLSpanElement | null, key: 'first' | 'second'): LineTarget | null => {
        if (!line || !center) return null;
        const to = document.querySelector<HTMLElement>(`[data-hero-line="${key}"]`)?.getBoundingClientRect();
        if (!to || line.offsetWidth === 0 || to.width === 0) return null;
        const centerRect = center.getBoundingClientRect();
        const fromLeft = centerRect.left + line.offsetLeft;
        const fromTop = centerRect.top + line.offsetTop;
        return { x: to.left - fromLeft, y: to.top - fromTop, scale: to.width / line.offsetWidth };
      };
      const first = measure(firstRef.current, 'first');
      const second = measure(secondRef.current, 'second');
      setTargets(first && second ? { first, second } : null);
      setQuickExit(quick);
      goTo('handoff');
      const duration = quick ? SKIP_HANDOFF_MS : HANDOFF_MS;
      window.setTimeout(() => {
        markIntroSeen(window.sessionStorage);
        onFinish();
      }, duration - OVERLAP_MS);
      window.setTimeout(onUnmount, duration);
    },
    [goTo, onFinish, onUnmount],
  );

  useEffect(() => {
    if (!started) return undefined;
    const counter = animate(count, layout.fragments.length, { duration: 0.9, ease: 'easeOut' });
    const timers = [
      window.setTimeout(() => goTo('system'), SYSTEM_AT),
      window.setTimeout(() => {
        goTo('meaning');
        animate(count, 1, { duration: 0.5, ease: 'easeInOut' });
      }, MEANING_AT),
      window.setTimeout(() => beginHandoff(false), HANDOFF_AT),
    ];
    return () => {
      counter.stop();
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [started, layout, count, goTo, beginHandoff]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        beginHandoff(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [beginHandoff]);

  const nameVisible = phase === 'meaning' || phase === 'handoff';
  const handoffDuration = (quickExit ? SKIP_HANDOFF_MS : HANDOFF_MS) / 1000;
  const lineAnimation = (key: 'first' | 'second') => {
    if (phase === 'handoff' && targets) {
      const target = targets[key];
      return { clipPath: VISIBLE_CLIP, x: target.x, y: target.y, scale: target.scale, opacity: 1 };
    }
    if (phase === 'handoff') return { clipPath: VISIBLE_CLIP, opacity: 0 };
    return { clipPath: nameVisible ? VISIBLE_CLIP : HIDDEN_CLIP, x: 0, y: 0, scale: 1, opacity: 1 };
  };
  const lineTransition = (delay: number) =>
    phase === 'handoff'
      ? { duration: handoffDuration, ease: EASE }
      : { duration: 0.68, delay, ease: EASE };
  const fadeOut = phase === 'handoff';

  return (
    <div
      className={styles.overlay}
      data-testid="intro-overlay"
      data-phase={phase}
      aria-hidden="true"
      onPointerDown={() => beginHandoff(true)}
    >
      <motion.div
        className={styles.paper}
        initial={{ opacity: 1 }}
        animate={{ opacity: fadeOut ? 0 : 1 }}
        transition={{ duration: quickExit ? 0.3 : 0.42, delay: fadeOut ? 0.12 : 0, ease: 'easeInOut' }}
      />

      <motion.div
        className={styles.metaTop}
        initial={{ opacity: 0 }}
        animate={{ opacity: fadeOut ? 0 : started ? 1 : 0 }}
        transition={{ duration: 0.32, delay: fadeOut ? 0 : 0.1 }}
      >
        <span>{content.intro.portfolio}</span>
        <span>{content.intro.cityYear}</span>
      </motion.div>

      <div
        className={styles.grid}
        style={{
          left: `${layout.area[0]}%`,
          top: `${layout.area[1]}%`,
          width: `${layout.area[2]}%`,
          height: `${layout.area[3]}%`,
        }}
      >
        {Array.from({ length: layout.columns - 1 }, (_, index) => (
          <motion.i
            key={`v-${index}`}
            className={styles.gridVertical}
            style={{ left: `${((index + 1) / layout.columns) * 100}%` }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={phase === 'system' ? { scaleY: 1, opacity: 1 } : { scaleY: phase === 'noise' ? 0 : 1, opacity: 0 }}
            transition={phase === 'system' ? { duration: 0.7, delay: index * 0.05, ease: EASE } : { duration: 0.24 }}
          />
        ))}
        {Array.from({ length: layout.rows - 1 }, (_, index) => (
          <motion.i
            key={`h-${index}`}
            className={styles.gridHorizontal}
            style={{ top: `${((index + 1) / layout.rows) * 100}%` }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={phase === 'system' ? { scaleX: 1, opacity: 1 } : { scaleX: phase === 'noise' ? 0 : 1, opacity: 0 }}
            transition={phase === 'system' ? { duration: 0.7, delay: 0.1 + index * 0.05, ease: EASE } : { duration: 0.24 }}
          />
        ))}
      </div>

      {started
        ? layout.fragments.map((fragment, index) => (
            <motion.span
              key={fragment.id}
              className={`${styles.fragment} ${styles[fragment.kind]}`}
              style={{ left: `${fragment.gridX}%`, top: `${fragment.gridY}%`, fontSize: `${fragment.size}rem` }}
              initial={{
                x: fragment.noiseDx,
                y: fragment.noiseDy + 16,
                rotate: fragment.noiseRotate,
                opacity: 0,
                scale: 0.94,
              }}
              animate={fragmentAnimation(phase, fragment)}
              transition={fragmentTransition(phase, index)}
            >
              {fragment.text}
            </motion.span>
          ))
        : null}

      {layout.keepers.map((keeper, index) => (
        <motion.span
          key={keeper.id}
          className={styles.keeper}
          style={{ left: `${keeper.gridX}%`, top: `${keeper.gridY}%` }}
          initial={{ opacity: 0, scale: 0.86 }}
          animate={keeperAnimation(phase, keeper, viewport)}
          transition={
            phase === 'system'
              ? { duration: 0.55, delay: 0.32 + index * 0.09, ease: EASE }
              : { duration: 0.42, delay: index * 0.04, ease: EASE }
          }
        >
          <i>{pad(index + 1)}</i>
          {keeper.text}
        </motion.span>
      ))}

      <div ref={centerRef} className={styles.center}>
        <p className={styles.nameLine}>
          <motion.span
            ref={firstRef}
            className={styles.nameFirst}
            initial={{ clipPath: HIDDEN_CLIP, x: 0, y: 0, scale: 1 }}
            animate={lineAnimation('first')}
            transition={lineTransition(0.02)}
          >
            {content.intro.nameFirst}
          </motion.span>
        </p>
        <p className={styles.nameLine}>
          <motion.span
            ref={secondRef}
            className={styles.nameSecond}
            initial={{ clipPath: HIDDEN_CLIP, x: 0, y: 0, scale: 1 }}
            animate={lineAnimation('second')}
            transition={lineTransition(0.1)}
          >
            {content.intro.nameSecond}
          </motion.span>
        </p>
        <motion.p
          className={styles.role}
          initial={{ opacity: 0, y: 8 }}
          animate={nameVisible && !fadeOut ? { opacity: 1, y: 0 } : { opacity: 0, y: fadeOut ? -6 : 8 }}
          transition={{ duration: fadeOut ? 0.2 : 0.45, delay: fadeOut ? 0 : 0.28, ease: EASE }}
        >
          {content.intro.role}
        </motion.p>
        <motion.div
          className={styles.sequence}
          initial={{ opacity: 0 }}
          animate={nameVisible && !fadeOut ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: fadeOut ? 0.18 : 0.4, delay: fadeOut ? 0 : 0.38 }}
        >
          {content.intro.keepers.map((keeper, index) => (
            <motion.span
              key={keeper}
              initial={{ opacity: 0, y: 6 }}
              animate={nameVisible && !fadeOut ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={{ duration: 0.36, delay: fadeOut ? 0 : 0.4 + index * 0.07, ease: EASE }}
            >
              <i>{pad(index + 1)}</i>
              {keeper}
            </motion.span>
          ))}
        </motion.div>
      </div>

      <motion.div
        className={styles.metaBottom}
        initial={{ opacity: 0 }}
        animate={{ opacity: fadeOut ? 0 : started ? 1 : 0 }}
        transition={{ duration: 0.32, delay: fadeOut ? 0 : 0.2 }}
      >
        <span>
          {content.intro.signalLabel} <b>{countLabel}</b> / {pad(layout.fragments.length)}
        </span>
        <motion.span
          className={styles.skipHint}
          initial={{ opacity: 0 }}
          animate={{ opacity: fadeOut ? 0 : 1 }}
          transition={{ duration: 0.4, delay: fadeOut ? 0 : 0.7 }}
        >
          {content.intro.skipHint}
        </motion.span>
      </motion.div>
    </div>
  );
}

/**
 * "From noise to meaning": feed fragments scatter, snap into a grid, dissolve into three
 * words, and the name lands exactly on the hero title. Plays once per browser session.
 */
export function Intro() {
  const { content } = useLocale();
  const { introActive, finishIntro } = useIntroGate();
  const [mounted, setMounted] = useState(introActive);
  const handleUnmount = useCallback(() => setMounted(false), []);

  if (!mounted) return null;
  return <IntroOverlay content={content} onFinish={finishIntro} onUnmount={handleUnmount} />;
}
