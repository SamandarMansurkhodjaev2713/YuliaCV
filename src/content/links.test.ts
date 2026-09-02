import { describe, expect, it } from 'vitest';
import { isAllowedSocialUrl } from './links';
import { locales, siteContent } from './site';
import { SECTION_ORDER } from './types';

describe('site content', () => {
  it('GIVEN the configured Telegram link WHEN validated THEN it is a safe supported URL', () => {
    expect(isAllowedSocialUrl(siteContent.contacts.telegram)).toBe(true);
  });

  it('GIVEN unsupported or unsafe schemes WHEN validated THEN they are rejected', () => {
    expect(isAllowedSocialUrl('javascript:alert(1)')).toBe(false);
    expect(isAllowedSocialUrl('http://t.me/yulleishn')).toBe(false);
    expect(isAllowedSocialUrl('https://example.com/profile')).toBe(false);
  });

  it('GIVEN navigation items WHEN inspected THEN they point at unique known sections', () => {
    for (const content of Object.values(locales)) {
      const sections = content.navigation.map((item) => item.section);
      expect(new Set(sections).size).toBe(sections.length);
      for (const section of sections) expect(SECTION_ORDER).toContain(section);
    }
  });

  it('GIVEN both locales WHEN compared THEN they share structure, contacts and section ids', () => {
    const { ru, en } = locales;
    expect(en.contacts).toEqual(ru.contacts);
    expect(en.navigation.map((item) => item.section)).toEqual(ru.navigation.map((item) => item.section));
    expect(en.caseStudy.steps.map((step) => step.id)).toEqual(ru.caseStudy.steps.map((step) => step.id));
    expect(en.experience.items.map((item) => item.id)).toEqual(ru.experience.items.map((item) => item.id));
    expect(en.method.items.map((item) => item.id)).toEqual(ru.method.items.map((item) => item.id));
    expect(en.intro.keepers).toHaveLength(ru.intro.keepers.length);
    expect(en.hero.strip).toHaveLength(ru.hero.strip.length);
    expect(en.hero.facts).toHaveLength(ru.hero.facts.length);
  });

  it('GIVEN the email contact WHEN inspected THEN it is a plain address without a scheme', () => {
    expect(siteContent.contacts.email).toMatch(/^[^\s@/]+@[^\s@/]+\.[a-z]+$/i);
  });
});
