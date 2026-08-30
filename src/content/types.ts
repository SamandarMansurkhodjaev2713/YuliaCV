export type ExternalUrl = `https://${string}`;
export type InternalHref = `#${string}` | `./${string}`;

export interface NavigationItem {
  readonly label: string;
  readonly href: `#${string}`;
  readonly index: string;
}

export interface MethodItem {
  readonly id: 'voice' | 'system' | 'action';
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly note: string;
}

export interface CaseStep {
  readonly id: 'packaging' | 'voice' | 'funnel' | 'creators' | 'strategy';
  readonly number: string;
  readonly title: string;
  readonly text: string;
  readonly label: string;
}

export interface ServiceItem {
  readonly number: string;
  readonly title: string;
  readonly description: string;
}

export interface ProcessItem {
  readonly number: string;
  readonly title: string;
  readonly description: string;
}

export interface EducationItem {
  readonly year: string;
  readonly title: string;
  readonly provider: string;
  readonly description: string;
}

export interface SiteContent {
  readonly navigation: readonly NavigationItem[];
  readonly hero: {
    readonly eyebrow: string;
    readonly titleFirst: string;
    readonly titleSecond: string;
    readonly description: string;
    readonly location: string;
    readonly primaryCta: string;
    readonly secondaryCta: string;
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
    readonly steps: readonly CaseStep[];
  };
  readonly services: {
    readonly eyebrow: string;
    readonly title: string;
    readonly description: string;
    readonly items: readonly ServiceItem[];
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
    readonly instagramLabel: string;
  };
  readonly contacts: {
    readonly telegram: ExternalUrl;
    readonly instagram: ExternalUrl | null;
    readonly cv: InternalHref;
  };
}
