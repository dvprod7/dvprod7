import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DEFAULT_LOCALE, SITE_CONTENT } from '../../core/content/site-content';
import { CopyPill } from './copy-pill';

describe('CopyPill', () => {
  const content = SITE_CONTENT[DEFAULT_LOCALE].contact.copyEmail;
  let fixture: ComponentFixture<CopyPill>;
  let host: HTMLElement;
  let openFallback: jasmine.Spy;

  const button = () => host.querySelector<HTMLButtonElement>('button')!;
  const status = () => host.querySelector('[aria-live]')!;
  // Whitespace collapsed, as the accessible name computation does.
  const text = (el: Element) => el.textContent?.replace(/\s+/g, ' ').trim();
  // The click handler awaits the clipboard: let its promise chain settle.
  const settle = async () => {
    for (let i = 0; i < 5; i++) {
      await Promise.resolve();
    }
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopyPill],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(CopyPill);
    fixture.componentRef.setInput('label', content.label);
    fixture.componentRef.setInput('value', content.address);
    fixture.componentRef.setInput('fallbackHref', content.fallbackHref);
    fixture.componentRef.setInput('actionLabel', content.actionLabel);
    fixture.componentRef.setInput('copiedLabel', content.copiedLabel);
    fixture.componentRef.setInput('copiedAnnouncement', content.copiedAnnouncement);
    await fixture.whenStable();
    host = fixture.nativeElement;
    // Never navigate away from the test page.
    openFallback = spyOn(
      fixture.componentInstance as unknown as { openFallback(): void },
      'openFallback',
    );
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('is a button named after its action, showing the label and holding the value', () => {
    expect(button().type).toBe('button');
    expect(button().getAttribute('aria-label')).toBe(content.actionLabel);
    // Label in name (WCAG 2.5.3): the visible label is part of the accessible name.
    expect(content.actionLabel.toLowerCase()).toContain(content.label.toLowerCase());
    expect(text(host.querySelector('.copy-pill__label')!)).toBe(content.label);
    expect(text(host.querySelector('.copy-pill__value')!)).toBe(content.address);
    expect(host.querySelector('a')).toBeNull();
  });

  it('keeps an empty polite live region until something is copied', () => {
    expect(status().getAttribute('aria-live')).toBe('polite');
    expect(text(status())).toBe('');
  });

  it('copies the value, then shows and announces the copied state for 2 s', async () => {
    const writeText = spyOn(navigator.clipboard, 'writeText').and.resolveTo();
    jasmine.clock().install();

    button().click();
    await settle();

    expect(writeText).toHaveBeenCalledOnceWith(content.address);
    expect(button().classList).toContain('copy-pill--copied');
    expect(text(host.querySelector('.copy-pill__label')!)).toBe(content.copiedLabel);
    expect(host.querySelector('.copy-pill__label app-icon')).not.toBeNull();
    expect(text(status())).toBe(content.copiedAnnouncement);
    expect(openFallback).not.toHaveBeenCalled();

    jasmine.clock().tick(2000);
    fixture.detectChanges();

    expect(button().classList).not.toContain('copy-pill--copied');
    expect(text(host.querySelector('.copy-pill__label')!)).toBe(content.label);
    expect(text(status())).toBe('');
  });

  it('falls back to the mailto link when the clipboard refuses', async () => {
    spyOn(navigator.clipboard, 'writeText').and.rejectWith(new Error('denied'));

    button().click();
    await settle();

    expect(openFallback).toHaveBeenCalledTimes(1);
    expect(button().classList).not.toContain('copy-pill--copied');
    expect(text(status())).toBe('');
  });

  it('falls back to the mailto link when there is no clipboard', async () => {
    spyOnProperty(navigator, 'clipboard').and.returnValue(undefined as unknown as Clipboard);

    button().click();
    await settle();

    expect(openFallback).toHaveBeenCalledTimes(1);
    expect(button().classList).not.toContain('copy-pill--copied');
  });

  describe('expansion', () => {
    // Width of the revealed value; transitions off so the end state is immediate.
    const revealed = () => host.querySelector('.copy-pill__reveal')!.getBoundingClientRect().width;

    beforeEach(() => {
      button().style.transition = 'none';
    });

    it('shows only the label at rest', () => {
      expect(revealed()).toBe(0);
    });

    it('reveals the value on keyboard focus', () => {
      button().focus();

      expect(button().matches(':focus-visible')).toBeTrue();
      expect(revealed()).toBeGreaterThan(0);
    });

    it('stays open while showing the copied state (a tap expands and copies)', async () => {
      spyOn(navigator.clipboard, 'writeText').and.resolveTo();

      button().click();
      button().blur();
      await settle();

      expect(revealed()).toBeGreaterThan(0);
    });
  });
});
