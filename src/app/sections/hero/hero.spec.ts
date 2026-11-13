import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DEFAULT_LOCALE, SITE_CONTENT } from '../../core/content/site-content';
import { Hero } from './hero';

describe('Hero', () => {
  const content = SITE_CONTENT[DEFAULT_LOCALE].hero;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hero],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(Hero);
    await fixture.whenStable();
    host = fixture.nativeElement;
  });

  it('is the only h1, and names the section', () => {
    const h1s = host.querySelectorAll('h1');

    expect(h1s.length).toBe(1);
    expect(h1s[0].textContent?.trim()).toBe(content.title);
    expect(host.querySelector('section')?.getAttribute('aria-labelledby')).toBe(h1s[0].id);
  });

  it('hides the eyebrow slash from assistive tech', () => {
    const eyebrow = host.querySelector('.hero__eyebrow');

    expect(eyebrow?.querySelector('[aria-hidden="true"]')?.textContent).toBe('/');
    expect(eyebrow?.textContent).toContain(content.eyebrow);
  });

  it('links both calls to action to their sections, primary first', () => {
    const links = Array.from(host.querySelectorAll<HTMLAnchorElement>('.hero__ctas a'));

    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      `#${content.primaryCta.sectionId}`,
      `#${content.secondaryCta.sectionId}`,
    ]);
    expect(links[0].classList).toContain('button--cta');
    expect(links[1].classList).toContain('button--outline');
  });

  it('keeps the emoji out of the accessible name', () => {
    const emoji = content.secondaryCta.emoji;
    const hidden = host.querySelectorAll('.hero__ctas [aria-hidden="true"]');

    expect(emoji).toBeDefined();
    expect(Array.from(hidden, (node) => node.textContent)).toEqual([emoji ?? '']);
  });

  it('shows the social links as icons', () => {
    const links = SITE_CONTENT[DEFAULT_LOCALE].socialLinks;
    const anchors = Array.from(host.querySelectorAll<HTMLAnchorElement>('app-social-links a'));

    expect(anchors.map((a) => a.getAttribute('href'))).toEqual(links.map((l) => l.href));
    expect(host.querySelectorAll('app-social-links app-icon').length).toBe(links.length);
  });

  it('has no decorative background image', () => {
    expect(host.querySelector('img')).toBeNull();
  });
});
