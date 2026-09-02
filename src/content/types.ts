export type ExternalUrl = `https://${string}`;
export type MailtoUrl = `mailto:${string}`;
export type InternalHref = `#${string}` | `./${string}`;

export type Locale = 'ru' | 'en';

/** Ordered section ids. Chapter numbering, navigation and the story-progress bar derive from this. */
export const SECTION_ORDER = [
  'approach',
  'case',
  'experience',
  'services',
  'process',
  'about',
  'education',
  'contact',
] as const;

export type SectionId = (typeof SECTION_ORDER)[number];

export interface NavigationItem {
  readonly label: string;
  readonly section: SectionId;
}

export interface MethodItem {
  readonly id: 'voice' | 'system' | 'action';
  readonly title: string;
  readonly description: string;
  readonly note: string;
  readonly visual: {
    readonly index: string;
    readonly lines: readonly string[];
    readonly note: string;
  };
}

export interface CaseStep {
  readonly id: 'packaging' | 'voice' | 'funnel' | 'creators' | 'strategy';
  readonly title: string;
  readonly text: string;
  readonly label: string;
}

export interface ExperienceItem {
  readonly id: string;
  readonly track: 'marketing' | 'people';
  readonly company: string;
  readonly role: string;
  readonly period: string;
  readonly location?: string;
  readonly current?: boolean;
  readonly summary: string;
  readonly highlights: readonly string[];
  readonly result?: string;
  readonly linkToCase?: boolean;
}

export interface ServiceItem {
  readonly title: string;
  readonly description: string;
}

export interface ProcessItem {
  readonly title: string;
  readonly description: string;
}

export interface EducationItem {
  readonly year: string;
  readonly title: string;
  readonly provider: string;
  readonly kind: string;
  readonly description: string;
}

export interface HeroFact {
  readonly value: string;
  readonly label: string;
}

export interface SiteContent {
  readonly meta: {
    readonly title: string;
    readonly description: string;
  };
  readonly ui: {
    readonly skipToContent: string;
    readonly brandLine: string;
    readonly brandAria: string;
    readonly menu: string;
    readonly close: string;
    readonly mainNavAria: string;
    readonly mobileNavAria: string;
    readonly telegramAria: string;
    readonly emailAria: string;
    readonly cvLabel: string;
    readonly cvAria: string;
    readonly headerCta: string;
    readonly languageAria: string;
    readonly chapter: string;
    readonly mobileBarCta: string;
    readonly footerRole: string;
    readonly footerCity: string;
  };
  readonly intro: {
    readonly portfolio: string;
    readonly cityYear: string;
    readonly noise: readonly string[];
    readonly keepers: readonly string[];
    readonly nameFirst: string;
    readonly nameSecond: string;
    readonly role: string;
    readonly skipHint: string;
    readonly signalLabel: string;
  };
  readonly navigation: readonly NavigationItem[];
  readonly hero: {
    readonly eyebrow: string;
    readonly titleFirst: string;
    readonly titleSecond: string;
    readonly description: string;
    readonly location: string;
    readonly primaryCta: string;
    readonly secondaryCta: string;
    readonly facts: readonly HeroFact[];
    readonly strip: readonly string[];
    readonly portraitAlt: string;
  };
  readonly method: {
    readonly eyebrow: string;
    readonly title: string;
    readonly description: string;
    readonly items: readonly MethodItem[];
  };
  readonly caseStudy: {
    readonly eyebrow: string;
    readonly title: string;
    readonly summary: string;
    readonly disclaimer: string;
    readonly mediaProject: string;
    readonly mediaSignature: string;
    readonly steps: readonly CaseStep[];
  };
  readonly experience: {
    readonly eyebrow: string;
    readonly title: string;
    readonly description: string;
    readonly totalValue: string;
    readonly totalLabel: string;
    readonly currentTag: string;
    readonly beforeMarketing: string;
    readonly beforeMarketingNote: string;
    readonly caseLink: string;
    readonly items: readonly ExperienceItem[];
  };
  readonly services: {
    readonly eyebrow: string;
    readonly title: string;
    readonly description: string;
    readonly items: readonly ServiceItem[];
    readonly footnoteLabel: string;
    readonly footnote: string;
  };
  readonly process: {
    readonly eyebrow: string;
    readonly title: string;
    readonly description: string;
    readonly items: readonly ProcessItem[];
  };
  readonly about: {
    readonly eyebrow: string;
    readonly title: string;
    readonly quote: string;
    readonly paragraphs: readonly string[];
    readonly facts: readonly string[];
  };
  readonly education: {
    readonly eyebrow: string;
    readonly title: string;
    readonly items: readonly EducationItem[];
  };
  readonly contact: {
    readonly eyebrow: string;
    readonly title: string;
    readonly description: string;
    readonly telegramLabel: string;
    readonly emailLabel: string;
    readonly note: string;
    readonly indexCaption: string;
  };
  readonly contacts: {
    readonly telegram: ExternalUrl;
    readonly telegramHandle: string;
    readonly email: string;
    readonly instagram: ExternalUrl | null;
    readonly cv: InternalHref;
  };
}
