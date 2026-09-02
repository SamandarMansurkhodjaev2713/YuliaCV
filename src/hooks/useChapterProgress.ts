import { useMotionValue } from 'motion/react';
import type { MotionValue } from 'motion/react';
import { useEffect, useState } from 'react';

export type ChapterTone = 'light' | 'dark';

export interface ChapterProgress {
  /** Index into the list of `[data-chapter]` elements in DOM order (hero is 0). */
  readonly activeIndex: number;
  readonly count: number;
  readonly tone: ChapterTone;
  /** 0..1 progress through the active chapter, updated every frame without re-rendering. */
  readonly progress: MotionValue<number>;
}

interface ChapterRect {
  readonly top: number;
  readonly height: number;
  readonly tone: ChapterTone;
}

function measure(elements: readonly HTMLElement[]): ChapterRect[] {
  return elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      height: Math.max(rect.height, 1),
      tone: element.dataset.tone === 'dark' ? 'dark' : 'light',
    };
  });
}

/** Tracks which page chapter is under the reader and how far through it they are. */
export function useChapterProgress(): ChapterProgress {
  const progress = useMotionValue(0);
  const [state, setState] = useState<{ activeIndex: number; count: number; tone: ChapterTone }>({
    activeIndex: 0,
    count: 0,
    tone: 'light',
  });

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]'));
    if (elements.length === 0) return undefined;

    let rects = measure(elements);
    let frameId = 0;
    let lastIndex = -1;
    let lastTone: ChapterTone | null = null;

    const update = () => {
      frameId = 0;
      const anchor = window.scrollY + window.innerHeight * 0.38;
      let index = 0;
      for (let i = 0; i < rects.length; i += 1) {
        const rect = rects[i];
        if (rect && anchor >= rect.top) index = i;
      }
      const active = rects[index];
      if (!active) return;
      const within = (anchor - active.top) / active.height;
      progress.set(Math.min(1, Math.max(0, within)));
      if (index !== lastIndex || active.tone !== lastTone) {
        lastIndex = index;
        lastTone = active.tone;
        setState({ activeIndex: index, count: rects.length, tone: active.tone });
      }
    };

    const schedule = () => {
      if (frameId === 0) frameId = window.requestAnimationFrame(update);
    };
    const remeasure = () => {
      rects = measure(elements);
      schedule();
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', remeasure);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(remeasure);
    observer?.observe(document.body);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', remeasure);
      observer?.disconnect();
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
    };
  }, [progress]);

  return { ...state, progress };
}
