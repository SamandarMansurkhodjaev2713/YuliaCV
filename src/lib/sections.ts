import { SECTION_ORDER } from '../content/types';
import type { SectionId } from '../content/types';

export const CHAPTER_COUNT = SECTION_ORDER.length;

export function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** 1-based chapter number of a section; the hero is chapter 0. */
export function chapterNumber(id: SectionId): number {
  return SECTION_ORDER.indexOf(id) + 1;
}

export function chapterLabel(id: SectionId): string {
  return pad(chapterNumber(id));
}

export function isSectionId(value: string): value is SectionId {
  return (SECTION_ORDER as readonly string[]).includes(value);
}
