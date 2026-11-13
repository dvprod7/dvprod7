import { DOCUMENT, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { DEFAULT_LOCALE, SITE_CONTENT, SITE_URL } from '../content/site-content';

// id of the JSON-LD script, so a second run updates it instead of adding one.
export const JSON_LD_ID = 'ld-person';

// Fills <head> from the content layer: title, description, canonical, Open
// Graph, Twitter card and the Person JSON-LD. Runs as an app initializer, so
// the prerender bakes the tags into the static HTML; in the browser it runs
// again and changes nothing (every write is an update, never an append).
// Uses the injected DOCUMENT, which exists while prerendering.
export function applySeo(): void {
  const document = inject(DOCUMENT);
  const meta = inject(Meta);
  const content = SITE_CONTENT[DEFAULT_LOCALE];
  const { title, description, person } = content.seo;

  inject(Title).setTitle(title);
  meta.updateTag({ name: 'description', content: description });

  // No og:image / twitter:image on purpose (post-launch: a 1200×630 image).
  meta.updateTag({ property: 'og:type', content: 'website' });
  meta.updateTag({ property: 'og:url', content: SITE_URL });
  meta.updateTag({ property: 'og:title', content: title });
  meta.updateTag({ property: 'og:description', content: description });
  meta.updateTag({ name: 'twitter:card', content: 'summary' });
  meta.updateTag({ name: 'twitter:title', content: title });
  meta.updateTag({ name: 'twitter:description', content: description });

  const canonical =
    document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]') ??
    document.head.appendChild(document.createElement('link'));
  canonical.rel = 'canonical';
  canonical.href = SITE_URL;

  const schema = {
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
    // External profiles only (GitHub, LinkedIn): mailto is not a profile.
    sameAs: content.socialLinks.filter((link) => link.newTab).map((link) => link.href),
  };
  const jsonLd =
    document.head.querySelector<HTMLScriptElement>(`script#${JSON_LD_ID}`) ??
    document.head.appendChild(document.createElement('script'));
  jsonLd.id = JSON_LD_ID;
  jsonLd.type = 'application/ld+json';
  // `<` escaped so no value can close the script element.
  jsonLd.textContent = JSON.stringify(schema).replace(/</g, '\u003c');
}
