import { useEffect, useState } from 'react';
import { SECTION_ORDER } from '../content/types';
import type { SectionId } from '../content/types';
import { isSectionId } from '../lib/sections';

export function useActiveSection(): SectionId | null {
  const [activeId, setActiveId] = useState<SectionId | null>(null);

  useEffect(() => {
    const sections = SECTION_ORDER.map((id) => document.getElementById(id)).filter(
      (section): section is HTMLElement => section !== null,
    );

    if (sections.length === 0 || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = visible?.target.id;
        if (id && isSectionId(id)) setActiveId(id);
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0.01, 0.15, 0.35, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return activeId;
}
