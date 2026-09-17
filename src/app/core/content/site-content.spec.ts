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
