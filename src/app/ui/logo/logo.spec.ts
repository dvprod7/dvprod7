import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DEFAULT_LOCALE, SITE_CONTENT } from '../../core/content/site-content';
import { Logo } from './logo';

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

describe('Logo', () => {
  let fixture: ComponentFixture<Logo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Logo],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Logo);
    fixture.componentRef.setInput('logo', SITE_CONTENT[DEFAULT_LOCALE].shell.logo);
    await fixture.whenStable();
  });

  it('shows the brackets but hides them from assistive tech', () => {
    const host: HTMLElement = fixture.nativeElement;

    expect(host.textContent).toBe('</dvprod7>');
    expect(exposedText(host)).toBe('dvprod7');
  });
});
