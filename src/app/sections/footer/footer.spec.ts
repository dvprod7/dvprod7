import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DEFAULT_LOCALE, SITE_CONTENT } from '../../core/content/site-content';
import { Footer } from './footer';

// Text a screen reader gets: aria-hidden subtrees are skipped.
function exposedText(node: Node): string {
  if (node instanceof Element && node.getAttribute('aria-hidden') === 'true') {
    return '';
  }
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? '';
  }
  return Array.from(node.childNodes, exposedText).join('');
}

describe('Footer', () => {
  const content = SITE_CONTENT[DEFAULT_LOCALE].shell.footer;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(Footer);
    await fixture.whenStable();
    host = fixture.nativeElement;
  });

  it('renders a footer landmark', () => {
    expect(host.querySelector('footer')).not.toBeNull();
  });

  it('exposes the logo as its name only', () => {
    const logo = host.querySelector('.footer__logo');

    expect(logo).not.toBeNull();
    expect(exposedText(logo as Element)).toBe('dvprod7');
    expect(logo?.textContent).toBe('</dvprod7>');
  });

  it('renders brand and location from the content layer', () => {
    const { open, name, close } = content.brand.logo;

    expect(host.querySelector('.footer__brand')?.textContent?.trim()).toBe(
      `${open}${name}${close}${content.brand.suffix}`,
    );
    expect(exposedText(host.querySelector('.footer__brand') as Element).trim()).toBe(
      `${name}${content.brand.suffix}`,
    );
    expect(host.querySelector('.footer__location')?.textContent?.trim()).toBe(content.location);
  });
});
