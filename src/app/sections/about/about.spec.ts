import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DEFAULT_LOCALE, SITE_CONTENT } from '../../core/content/site-content';
import { About } from './about';

describe('About', () => {
  const content = SITE_CONTENT[DEFAULT_LOCALE].about;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [About],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(About);
    await fixture.whenStable();
    host = fixture.nativeElement;
  });

  it('names the section after its h2, emoji hidden', () => {
    const h2 = host.querySelector('h2');
    const hidden = h2?.querySelector('[aria-hidden="true"]');

    expect(host.querySelector('section')?.getAttribute('aria-labelledby')).toBe(h2?.id ?? '');
    expect(hidden?.textContent).toBe(content.heading.emoji ?? '');
    expect(h2?.textContent?.replace(hidden?.textContent ?? '', '').trim()).toBe(
      content.heading.title,
    );
  });

  it('renders the pillars as a list of h3 + description, in content order', () => {
    const pillars = Array.from(host.querySelectorAll('.about__pillars > li'));

    expect(pillars.map((p) => p.querySelector('h3')?.textContent?.trim())).toEqual(
      content.pillars.map((p) => p.title),
    );
    expect(pillars.map((p) => p.querySelector('p')?.textContent?.trim())).toEqual(
      content.pillars.map((p) => p.description),
    );
  });

  it('downloads the CV from the primary button', () => {
    const cv = host.querySelector<HTMLAnchorElement>('app-button a');

    expect(cv?.getAttribute('href')).toBe(content.cv.href);
    expect(cv?.hasAttribute('download')).toBeTrue();
    expect(cv?.textContent?.trim()).toBe(content.cv.label);
    expect(cv?.classList).toContain('button--cta');
  });

  it('serves the photo as AVIF with a WebP fallback, sized to avoid layout shift', () => {
    const img = host.querySelector('picture img');

    expect(host.querySelector('picture source')?.getAttribute('type')).toBe('image/avif');
    expect(img?.getAttribute('src')).toMatch(/\.webp$/);
    expect(img?.getAttribute('alt')).toBe(content.photoAlt);
    expect(img?.getAttribute('width')).toBeTruthy();
    expect(img?.getAttribute('height')).toBeTruthy();
  });
});
