import { DOCUMENT, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DEFAULT_LOCALE, SITE_CONTENT, SITE_URL } from '../content/site-content';
import { JSON_LD_ID, applySeo } from './seo';

describe('applySeo', () => {
  const content = SITE_CONTENT[DEFAULT_LOCALE];
  const { title, description, person } = content.seo;
  let head: HTMLHeadElement;
  let document: Document;
  let originalTitle: string;

  const metaContent = (selector: string) =>
    head.querySelector(`meta[${selector}]`)?.getAttribute('content');
  const run = () => TestBed.runInInjectionContext(applySeo);

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    document = TestBed.inject(DOCUMENT);
    head = document.head;
    originalTitle = document.title;
    run();
  });

  // The test page shares <head>: leave it as it was.
  afterEach(() => {
    head
      .querySelectorAll(
        `meta[name="description"], meta[property^="og:"], meta[name^="twitter:"], ` +
          `link[rel="canonical"], script#${JSON_LD_ID}`,
      )
      .forEach((el) => el.remove());
    document.title = originalTitle;
  });

  it('sets the title and description from the content layer', () => {
    expect(document.title).toBe(title);
    expect(metaContent('name="description"')).toBe(description);
  });

  it('points the canonical and og:url at the site URL', () => {
    expect(head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(SITE_URL);
    expect(metaContent('property="og:url"')).toBe(SITE_URL);
  });

  it('adds Open Graph and Twitter tags, without an image', () => {
    expect(metaContent('property="og:type"')).toBe('website');
    expect(metaContent('property="og:title"')).toBe(title);
    expect(metaContent('property="og:description"')).toBe(description);
    expect(metaContent('name="twitter:card"')).toBe('summary');
    expect(metaContent('name="twitter:title"')).toBe(title);
    expect(metaContent('name="twitter:description"')).toBe(description);
    expect(head.querySelector('meta[property="og:image"], meta[name="twitter:image"]')).toBeNull();
  });

  it('describes the Person in JSON-LD, with the external profiles as sameAs', () => {
    const script = head.querySelector(`script#${JSON_LD_ID}`);
    const data = JSON.parse(script?.textContent ?? '{}');

    expect(script?.getAttribute('type')).toBe('application/ld+json');
    expect(data).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: person.name,
      jobTitle: person.jobTitle,
      url: SITE_URL,
      address: {
        '@type': 'PostalAddress',
        addressLocality: person.locality,
        addressCountry: person.country,
      },
      sameAs: content.socialLinks.filter((l) => l.newTab).map((l) => l.href),
    });
    expect(data.sameAs.length).toBe(2);
  });

  it('updates instead of adding when it runs again (prerender, then browser)', () => {
    run();

    expect(head.querySelectorAll('meta[name="description"]').length).toBe(1);
    expect(head.querySelectorAll('meta[property="og:title"]').length).toBe(1);
    expect(head.querySelectorAll('link[rel="canonical"]').length).toBe(1);
    expect(head.querySelectorAll(`script#${JSON_LD_ID}`).length).toBe(1);
  });
});

// Static files in public/ cannot import SITE_URL: this keeps them in sync.
describe('robots.txt and sitemap.xml', () => {
  const text = async (path: string) => (await fetch(path)).text();

  it('allows every crawler and points at the sitemap', async () => {
    const robots = await text('/robots.txt');

    expect(robots).toMatch(/^User-agent: \*$/m);
    expect(robots).toMatch(/^Allow: \/$/m);
    expect(robots).toContain(`Sitemap: ${SITE_URL}sitemap.xml`);
  });

  it('lists the single page at the canonical URL', async () => {
    const sitemap = new DOMParser().parseFromString(await text('/sitemap.xml'), 'application/xml');

    expect(Array.from(sitemap.querySelectorAll('url > loc'), (loc) => loc.textContent)).toEqual([
      SITE_URL,
    ]);
  });
});
