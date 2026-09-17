import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DEFAULT_LOCALE, SITE_CONTENT } from '../../core/content/site-content';
import { Nav } from './nav';

describe('Nav', () => {
  const content = SITE_CONTENT[DEFAULT_LOCALE].shell;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nav],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(Nav);
    await fixture.whenStable();
    host = fixture.nativeElement;
  });

  it('renders a banner with a labelled navigation', () => {
    expect(host.querySelector('header')).not.toBeNull();
    expect(host.querySelector('nav')?.getAttribute('aria-label')).toBe(content.nav.ariaLabel);
  });

  it('links the logo to the main landmark, named after the product', () => {
    const logo = host.querySelector<HTMLAnchorElement>('.nav__logo');

    expect(logo?.getAttribute('href')).toBe('#main');
    expect(logo?.textContent).toBe('</dvprod7>');
  });

  it('links every section anchor, in content order', () => {
    const links = Array.from(host.querySelectorAll<HTMLAnchorElement>('.nav__link'));

    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      content.nav.links.map((link) => `#${link.sectionId}`),
    );
    expect(links.map((link) => link.textContent?.trim())).toEqual(
      content.nav.links.map((link) => `/ ${link.label}`),
    );
  });

  it('hides the decorative slash from assistive tech', () => {
    const slashes = Array.from(host.querySelectorAll('.nav__slash'));

    expect(slashes.length).toBe(content.nav.links.length);
    for (const slash of slashes) {
      expect(slash.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('keeps the language switch out of the DOM while it is disabled', () => {
    expect(host.querySelector('.nav__lang')).toBeNull();
  });
});
