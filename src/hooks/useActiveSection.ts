import { useEffect, useState } from 'react';

const SECTION_IDS = ['approach', 'case', 'services', 'about', 'contact'] as const;
export type ActiveSectionId = (typeof SECTION_IDS)[number] | null;

export function useActiveSection(): ActiveSectionId {
  const [activeId, setActiveId] = useState<ActiveSectionId>(null);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (section): section is HTMLElement => section !== null,
    );

    if (sections.length === 0 || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id && SECTION_IDS.includes(visible.target.id as (typeof SECTION_IDS)[number])) {
          setActiveId(visible.target.id as (typeof SECTION_IDS)[number]);
        }
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0.01, 0.15, 0.35, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return activeId;
}
