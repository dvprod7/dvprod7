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
}

export interface SiteContent {
  readonly shell: ShellContent;
  readonly socialLinks: readonly SocialLink[];
}

// Only the default locale is required. Adding Spanish means adding its entry
// (from its own file), never touching components.
export type SiteContentByLocale = Readonly<Record<typeof DEFAULT_LOCALE, SiteContent>> &
  Readonly<Partial<Record<Locale, SiteContent>>>;

const LOGO: LogoContent = { open: '</', name: 'dvprod7', close: '>' };

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
    socialLinks: [
      { id: 'email', label: 'Email', href: 'mailto:danieling2203@gmail.com', icon: 'at' },
      { id: 'github', label: 'GitHub', href: 'https://github.com/dvprod7', icon: 'github' },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/dvprod7/',
        icon: 'linkedin',
      },
    ],
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
