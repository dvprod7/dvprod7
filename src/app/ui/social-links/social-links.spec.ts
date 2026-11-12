import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DEFAULT_LOCALE, SITE_CONTENT } from '../../core/content/site-content';
import { SocialLinks } from './social-links';

describe('SocialLinks', () => {
  const links = SITE_CONTENT[DEFAULT_LOCALE].socialLinks;
  const hint = SITE_CONTENT[DEFAULT_LOCALE].a11y.newTabHint;
  let fixture: ComponentFixture<SocialLinks>;
  let host: HTMLElement;

  const anchors = () => Array.from(host.querySelectorAll<HTMLAnchorElement>('a'));
  // Whitespace collapsed, as the accessible name computation does.
  const text = (a: HTMLAnchorElement) => a.textContent?.replace(/\s+/g, ' ').trim();
  const named = (label: string, newTab: boolean) => (newTab ? `${label} ${hint}` : label);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialLinks],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialLinks);
    fixture.componentRef.setInput('links', links);
    fixture.componentRef.setInput('newTabHint', hint);
    await fixture.whenStable();
    host = fixture.nativeElement;
  });

  it('renders every link, in content order, as a list', () => {
    expect(host.querySelectorAll('ul > li').length).toBe(links.length);
    expect(anchors().map((a) => a.getAttribute('href'))).toEqual(links.map((l) => l.href));
  });

  it('names the icon-only links after their label, with the new-tab hint', () => {
    expect(anchors().map((a) => a.getAttribute('aria-label'))).toEqual(
      links.map((l) => named(l.label, l.newTab)),
    );
    expect(anchors().map((a) => a.textContent?.trim())).toEqual(links.map(() => ''));
    expect(
      Array.from(host.querySelectorAll('use'), (use) => use.getAttribute('href')?.split('#')[1]),
    ).toEqual(links.map((l) => l.icon));
  });

  it('opens external links in a new tab, safely, and leaves mailto alone', () => {
    for (const [i, link] of links.entries()) {
      const anchor = anchors()[i];

      expect(anchor.getAttribute('target'))
        .withContext(link.id)
        .toBe(link.newTab ? '_blank' : null);
      expect(anchor.getAttribute('rel'))
        .withContext(link.id)
        .toBe(link.newTab ? 'noopener noreferrer' : null);
    }
  });

  it('shows the label as text in the pill variant, without icons', async () => {
    fixture.componentRef.setInput('variant', 'pill');
    await fixture.whenStable();

    expect(anchors().map(text)).toEqual(links.map((l) => named(l.label, l.newTab)));
    expect(anchors().every((a) => !a.hasAttribute('aria-label'))).toBeTrue();
    expect(anchors().map((a) => a.getAttribute('target'))).toEqual(
      links.map((l) => (l.newTab ? '_blank' : null)),
    );
    expect(host.querySelector('app-icon')).toBeNull();
  });
});
