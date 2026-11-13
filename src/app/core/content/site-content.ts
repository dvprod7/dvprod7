// Site copy, typed by locale. Source of truth for every UI string: templates
// never hold text. Visible copy comes from Figma V3; aria labels are ours.
import { IconName } from '../models/icon';
import { SectionId } from '../models/section-id';

export const LOCALES = ['en', 'es'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE = 'en' satisfies Locale;

export interface NavLink {
  // Plain case: the uppercase and the leading slash are presentational.
  readonly label: string;
  readonly sectionId: SectionId;
}

// `</dvprod7>`: the brackets are decoration (aria-hidden in the template), so
// screen readers only hear the name.
export interface LogoContent {
  readonly open: string;
  readonly name: string;
  readonly close: string;
}

export interface ShellContent {
  readonly logo: LogoContent;
  readonly skipLink: string;
  readonly nav: {
    readonly ariaLabel: string;
    readonly links: readonly NavLink[];
    readonly openMenu: string;
    readonly closeMenu: string;
  };
  readonly menu: {
    readonly ariaLabel: string;
    // The year is appended at render time, so this text never goes stale.
    readonly copyright: string;
  };
  readonly footer: {
    readonly brand: {
      readonly logo: LogoContent;
      // Rendered right after the logo, leading space included.
      readonly suffix: string;
    };
    readonly location: string;
  };
}

// Email, GitHub, LinkedIn: the same three links in the hero, the mobile menu
// and Contact. The label is visible on Contact's pills and is the accessible
// name of the icon-only links.
export interface SocialLink {
  readonly id: 'email' | 'github' | 'linkedin';
  readonly label: string;
  readonly href: string;
  readonly icon: IconName;
  // External profiles open in a new tab; mailto stays where it is.
  readonly newTab: boolean;
}

// A button that jumps to a section of the page.
export interface SectionCta {
  readonly label: string;
  readonly sectionId: SectionId;
  // Decorative: rendered after the label, hidden from assistive tech.
  readonly emoji?: string;
}

// Eyebrow and h2 of a section. The eyebrow's leading slash is presentational,
// as in the nav; so is its uppercase where the design shows one.
export interface SectionHeading {
  readonly eyebrow: string;
  readonly title: string;
  // Decorative, like SectionCta.emoji.
  readonly emoji?: string;
}

export interface HeroContent {
  readonly eyebrow: string;
  // Plain case: the uppercase is presentational.
  readonly title: string;
  readonly lead: string;
  readonly primaryCta: SectionCta;
  readonly secondaryCta: SectionCta;
}

export interface SkillGroup {
  readonly title: string;
  // Unique within a group: they double as the @for track key.
  readonly items: readonly string[];
}

export interface SkillsContent {
  readonly heading: SectionHeading;
  // Titles are unique: they double as the @for track key.
  readonly groups: readonly SkillGroup[];
}

export interface Pillar {
  readonly title: string;
  readonly description: string;
}

export interface AboutContent {
  readonly heading: SectionHeading;
  readonly body: string;
  // Titles are unique: they double as the @for track key.
  readonly pillars: readonly Pillar[];
  readonly cv: {
    readonly label: string;
    readonly href: string;
  };
  readonly photoAlt: string;
}

// One card. Tags are unique within a project (the @for track key) and headings
// are unique across the section (same reason).
export interface Project {
  readonly heading: string;
  readonly description: string;
  readonly tags: readonly string[];
}

export interface ProjectsContent {
  readonly heading: SectionHeading;
  readonly intro: string;
  readonly selected: readonly Project[];
  readonly buildingNow: {
    // Plain case, like every eyebrow-style label.
    readonly title: string;
    readonly intro: string;
    // The chip every card of this block shows first.
    readonly status: string;
    readonly projects: readonly Project[];
  };
}

export interface ContactContent {
  readonly heading: SectionHeading;
  readonly body: string;
  readonly cta: {
    readonly label: string;
    readonly href: string;
  };
}

export interface SiteContent {
  readonly shell: ShellContent;
  readonly hero: HeroContent;
  readonly skills: SkillsContent;
  readonly about: AboutContent;
  readonly projects: ProjectsContent;
  readonly contact: ContactContent;
  readonly socialLinks: readonly SocialLink[];
  readonly a11y: {
    // Added to the accessible name of every link that opens a new tab.
    readonly newTabHint: string;
  };
}

// Only the default locale is required. Adding Spanish means adding its entry
// (from its own file), never touching components.
export type SiteContentByLocale = Readonly<Record<typeof DEFAULT_LOCALE, SiteContent>> &
  Readonly<Partial<Record<Locale, SiteContent>>>;

const LOGO: LogoContent = { open: '</', name: 'dvprod7', close: '>' };

// Public contact address: the Email link and the "Say hello" button.
const EMAIL_HREF = 'mailto:dvprod7@gmail.com';

export const SITE_CONTENT: SiteContentByLocale = {
  en: {
    shell: {
      logo: LOGO,
      skipLink: 'Skip to content',
      nav: {
        ariaLabel: 'Primary',
        links: [
          { label: 'About', sectionId: 'about' },
          { label: 'Skills', sectionId: 'skills' },
          { label: 'Projects', sectionId: 'projects' },
          { label: 'Contact', sectionId: 'contact' },
        ],
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
      },
      menu: {
        ariaLabel: 'Menu',
        copyright: 'dvprod7 ©',
      },
      footer: {
        brand: { logo: LOGO, suffix: ' — Daniel Valenzuela' },
        location: 'Bogotá, Colombia · Available for remote work',
      },
    },
    hero: {
      eyebrow: 'Hi, I’m Daniel Valenzuela',
      title: 'Web developer',
      lead: 'I build reliable websites and web apps — from front-end interfaces to CMS-driven backends.',
      primaryCta: { label: 'View Projects', sectionId: 'projects' },
      secondaryCta: { label: 'Hire me', sectionId: 'contact', emoji: '😎' },
    },
    skills: {
      heading: { eyebrow: 'Skills', title: 'What I work with' },
      groups: [
        {
          title: 'Core / Frontend',
          items: [
            'HTML',
            'CSS / SCSS',
            'JavaScript',
            'Component-based UI',
            'Responsive & accessible layouts',
          ],
        },
        {
          title: 'CMS & Frameworks',
          items: ['Drupal (PHP · Twig)', 'WordPress (PHP)', 'Angular', 'WooCommerce', 'Shopify'],
        },
        {
          title: 'Workflow & Tooling',
          items: [
            'Git',
            'CI/CD & multidev deploys',
            'CDN / caching',
            'Jira',
            'AI-assisted development',
          ],
        },
        {
          title: 'Also familiar with',
          items: [
            'Web performance (Core Web Vitals)',
            'Google Tag Manager',
            'Web analytics',
            'Technical SEO',
          ],
        },
      ],
    },
    about: {
      heading: { eyebrow: 'About', title: 'I like to code', emoji: '💻' },
      body: 'I’m Daniel, a web developer who builds reliable websites and web applications. I work across the stack — from front-end interfaces to CMS-driven backends in Drupal and WordPress — and I ship in real teams, with Git, code reviews, and deployment workflows. Today I work on the web platform of a US-based SaaS company.',
      pillars: [
        {
          title: 'Production experience',
          description: 'Shipping in a US-based SaaS team — multidev, CDN, code reviews, sprints.',
        },
        {
          title: 'Front-end + CMS',
          description: 'Comfortable across the interface and PHP/CMS logic in Drupal & WordPress.',
        },
        {
          title: 'Judgment with AI',
          description: 'I use AI to move fast, but I direct it and stand behind the code.',
        },
      ],
      cv: {
        label: 'Download CV',
        href: '/DanielValenzuela_FrontEndDeveloper_CV_EN_2025.pdf',
      },
      photoAlt: 'Portrait of Daniel Valenzuela',
    },
    // Projects are placeholders until Dany writes the real copy: each one has a
    // TODO(content) comment and a visible [TODO] marker. The component cannot
    // tell, and does not need to.
    projects: {
      heading: { eyebrow: 'Projects', title: 'Selected work' },
      intro: 'Real work and real decisions — not demos. Evidence over adjectives.',
      selected: [
        // TODO(content): real project copy and tags.
        {
          heading: '[TODO] Enterprise SaaS website — performance',
          description:
            '[TODO] Investigated slow mobile load across five priority pages (LCP, TBT, CLS) and audited the tag-management setup. Delivered a prioritized, evidence-based optimization roadmap the team adopted.',
          tags: ['Performance', 'Core Web Vitals', 'GTM'],
        },
        // TODO(content): real project copy and tags.
        {
          heading: '[TODO] dvprod7 — this portfolio',
          description:
            '[TODO] Designed the UI in Figma and built it as an Angular app — an end-to-end project from design to deploy. Built to scale as I keep adding work over time.',
          tags: ['Angular', 'Figma', 'Design → Deploy'],
        },
      ],
      buildingNow: {
        title: 'Building now',
        intro: 'Two projects in progress — shipping soon. Momentum you can watch on GitHub.',
        status: 'Building now',
        projects: [
          // TODO(content): real project copy and tags.
          {
            heading: '[TODO] Meta Conversions API — WP plugin',
            description:
              '[TODO] A free, open-source alternative to connect Meta’s Conversions API manually via hooks — no third-party tool required. Born from a real client need.',
            tags: ['PHP', 'WordPress'],
          },
          // TODO(content): real project copy and tags.
          {
            heading: '[TODO] Custom ecommerce — React',
            description:
              '[TODO] A storefront bringing marketing, front-end and back-end together in one build — my project to close the gap with the backend.',
            tags: ['React', 'Full-stack'],
          },
        ],
      },
    },
    contact: {
      heading: { eyebrow: 'Contact', title: 'Ready to start?' },
      body: 'Got a project or a role in mind? I build and ship web, and I’m open to remote work and collaborations. Let’s talk.',
      cta: { label: 'Say hello', href: EMAIL_HREF },
    },
    socialLinks: [
      {
        id: 'email',
        label: 'Email',
        href: EMAIL_HREF,
        icon: 'at',
        newTab: false,
      },
      {
        id: 'github',
        label: 'GitHub',
        href: 'https://github.com/dvprod7',
        icon: 'github',
        newTab: true,
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/dvprod7/',
        icon: 'linkedin',
        newTab: true,
      },
    ],
    a11y: {
      newTabHint: '(opens in a new tab)',
    },
  },
};

// ESP / ENG switch: designed, but hidden until Spanish copy exists.
// The labels are the same in every locale, so they live outside SITE_CONTENT.
export const LANGUAGE_SWITCH: {
  readonly enabled: boolean;
  readonly labels: Readonly<Record<Locale, string>>;
} = {
  enabled: false,
  labels: { es: 'ESP', en: 'ENG' },
};
