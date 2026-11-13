import { SECTION_IDS } from '../models/section-id';
import {
  DEFAULT_LOCALE,
  LANGUAGE_SWITCH,
  LOCALES,
  SITE_CONTENT,
  SiteContent,
} from './site-content';

// Plain data: no TestBed needed.
function collectStrings(value: unknown, path: string): (readonly [string, string])[] {
  if (typeof value === 'string') {
    return [[path, value]];
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) => collectStrings(child, `${path}.${key}`));
  }
  return [];
}

describe('SITE_CONTENT', () => {
  const entries = Object.entries(SITE_CONTENT) as [string, SiteContent][];

  it('has content for the default locale', () => {
    expect(SITE_CONTENT[DEFAULT_LOCALE]).toBeDefined();
  });

  it('only has known locales', () => {
    for (const [locale] of entries) {
      expect(LOCALES)
        .withContext(locale)
        .toContain(locale as (typeof LOCALES)[number]);
    }
  });

  it('links every nav item to a valid section, once each', () => {
    for (const [locale, content] of entries) {
      const ids = content.shell.nav.links.map((link) => link.sectionId);

      for (const id of ids) {
        expect(SECTION_IDS).withContext(`${locale}: ${id}`).toContain(id);
      }
      expect(new Set(ids).size).withContext(`${locale}: duplicated section`).toBe(ids.length);
    }
  });

  it('keeps the logo name free of decorative symbols', () => {
    for (const [locale, content] of entries) {
      const logos = [content.shell.logo, content.shell.footer.brand.logo];

      for (const logo of logos) {
        expect(logo.name).withContext(locale).not.toMatch(/[</>]/);
        // Visually it still reads as in Figma.
        expect(`${logo.open}${logo.name}${logo.close}`).withContext(locale).toBe('</dvprod7>');
      }
    }
  });

  it('has each social link once, with a usable href', () => {
    for (const [locale, content] of entries) {
      const ids = content.socialLinks.map((link) => link.id);

      expect(new Set(ids).size).withContext(`${locale}: duplicated link`).toBe(ids.length);
      for (const link of content.socialLinks) {
        expect(link.href)
          .withContext(`${locale}: ${link.id}`)
          .toMatch(/^(https:\/\/|mailto:)/);
        // External profiles open a new tab; mailto never does.
        expect(link.newTab)
          .withContext(`${locale}: ${link.id}`)
          .toBe(link.href.startsWith('https://'));
      }
    }
  });

  it('keeps project headings unique, and tags unique within each project', () => {
    for (const [locale, content] of entries) {
      const projects = [...content.projects.selected, ...content.projects.buildingNow.projects];
      const headings = projects.map((p) => p.heading);

      expect(new Set(headings).size)
        .withContext(`${locale}: duplicated heading`)
        .toBe(headings.length);
      for (const project of projects) {
        expect(new Set(project.tags).size)
          .withContext(`${locale}: ${project.heading}`)
          .toBe(project.tags.length);
        // The status chip is added by the card; repeating it as a tag would show it twice.
        expect(project.tags).not.toContain(content.projects.buildingNow.status);
      }
    }
  });

  it('gives every project link a unique label, a usable href and the right tab', () => {
    for (const [locale, content] of entries) {
      const projects = [...content.projects.selected, ...content.projects.buildingNow.projects];

      for (const project of projects) {
        const links = project.links ?? [];
        const labels = links.map((link) => link.label);

        expect(new Set(labels).size)
          .withContext(`${locale}: ${project.heading}`)
          .toBe(labels.length);
        for (const link of links) {
          expect(link.href)
            .withContext(`${locale}: ${link.label}`)
            .toMatch(/^https:\/\//);
          // External links open a new tab, as the social links do.
          expect(link.newTab).withContext(`${locale}: ${link.label}`).toBeTrue();
        }
      }
    }
  });

  it('points the contact button, the copy pill and the Email link at the same address', () => {
    for (const [locale, content] of entries) {
      const email = content.socialLinks.find((link) => link.id === 'email');
      const copy = content.contact.copyEmail;

      expect(content.contact.cta.href)
        .withContext(locale)
        .toBe(email?.href ?? '');
      expect(copy.fallbackHref)
        .withContext(locale)
        .toBe(email?.href ?? '');
      expect(copy.fallbackHref).withContext(locale).toBe(`mailto:${copy.address}`);
      expect(copy.label)
        .withContext(locale)
        .toBe(email?.label ?? '');
    }
  });

  it('starts the logo link name with the visible name (WCAG 2.5.3)', () => {
    for (const [locale, content] of entries) {
      expect(content.shell.logoLinkLabel.startsWith(content.shell.logo.name))
        .withContext(locale)
        .toBeTrue();
    }
  });

  it('has no empty strings', () => {
    const strings = entries.flatMap(([locale, content]) => collectStrings(content, locale));

    expect(strings.length).toBeGreaterThan(0);
    for (const [path, text] of strings) {
      expect(text.trim()).withContext(path).not.toBe('');
    }
  });
});

describe('LANGUAGE_SWITCH', () => {
  it('stays hidden until Spanish copy exists', () => {
    expect(LANGUAGE_SWITCH.enabled).toBe(SITE_CONTENT.es !== undefined);
  });

  it('has a label for every locale', () => {
    for (const locale of LOCALES) {
      expect(LANGUAGE_SWITCH.labels[locale].trim()).withContext(locale).not.toBe('');
    }
  });
});
