import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DEFAULT_LOCALE, SITE_CONTENT } from '../../core/content/site-content';
import { Contact } from './contact';

describe('Contact', () => {
  const content = SITE_CONTENT[DEFAULT_LOCALE].contact;
  const links = SITE_CONTENT[DEFAULT_LOCALE].socialLinks;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contact],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(Contact);
    await fixture.whenStable();
    host = fixture.nativeElement;
  });

  it('names the section after its h2', () => {
    const h2 = host.querySelector('h2');

    expect(h2?.textContent?.trim()).toBe(content.heading.title);
    expect(host.querySelector('section')?.getAttribute('aria-labelledby')).toBe(h2?.id ?? '');
  });

  it('says hello with the accent button, in the same tab', () => {
    const button = host.querySelector<HTMLAnchorElement>('app-button a');

    expect(button?.getAttribute('href')).toBe(content.cta.href);
    expect(button?.textContent?.trim()).toBe(content.cta.label);
    expect(button?.classList).toContain('button--accent');
    expect(button?.hasAttribute('target')).toBeFalse();
  });

  it('shows the social links as text pills', () => {
    const pills = Array.from(
      host.querySelectorAll<HTMLAnchorElement>('app-social-links .social-links__pill'),
    );

    expect(pills.map((a) => a.getAttribute('href'))).toEqual(links.map((l) => l.href));
    expect(host.querySelector('app-social-links app-icon')).toBeNull();
  });

  it('has no form: contact is direct links only', () => {
    expect(host.querySelector('form, input, textarea')).toBeNull();
  });
});
