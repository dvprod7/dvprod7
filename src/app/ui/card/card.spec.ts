import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Card } from './card';

describe('Card', () => {
  let fixture: ComponentFixture<Card>;
  let host: HTMLElement;

  const chips = () =>
    Array.from(host.querySelectorAll<HTMLElement>('.chip'), (chip) => ({
      text: chip.textContent?.trim(),
      cta: chip.classList.contains('chip--cta'),
    }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Card],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Card);
    fixture.componentRef.setInput('heading', 'Title');
    fixture.componentRef.setInput('description', 'Description');
    fixture.componentRef.setInput('tags', ['Angular', 'Figma']);
    await fixture.whenStable();
    host = fixture.nativeElement;
  });

  it('renders an article with a level-3 heading and its description', () => {
    expect(host.querySelector('article h3')?.textContent?.trim()).toBe('Title');
    expect(host.querySelector('.card__description')?.textContent?.trim()).toBe('Description');
  });

  it('drops the heading to level 4 when asked', async () => {
    fixture.componentRef.setInput('headingLevel', 4);
    await fixture.whenStable();

    expect(host.querySelector('article h3')).toBeNull();
    expect(host.querySelector('article h4.card__title')?.textContent?.trim()).toBe('Title');
  });

  it('lists the tags as plain chips, in order', () => {
    expect(chips()).toEqual([
      { text: 'Angular', cta: false },
      { text: 'Figma', cta: false },
    ]);
    expect(host.querySelector('.card')?.classList).not.toContain('card--cta');
  });

  it('puts the status first, as a cta chip, and marks the card', async () => {
    fixture.componentRef.setInput('status', 'Building now');
    await fixture.whenStable();

    expect(chips()[0]).toEqual({ text: 'Building now', cta: true });
    expect(chips().length).toBe(3);
    expect(host.querySelector('.card')?.classList).toContain('card--cta');
  });

  it('drops the tag list when there is nothing to show', async () => {
    fixture.componentRef.setInput('tags', []);
    await fixture.whenStable();

    expect(host.querySelector('ul')).toBeNull();
  });

  describe('links', () => {
    const hint = '(opens in a new tab)';
    const links = () => Array.from(host.querySelectorAll<HTMLAnchorElement>('.card__link'));
    // Whitespace collapsed, as the accessible name computation does.
    const text = (a: HTMLAnchorElement) => a.textContent?.replace(/\s+/g, ' ').trim();

    it('renders no link list by default, so the card looks as before', () => {
      expect(host.querySelector('.card__links')).toBeNull();
    });

    it('lists the links in order, at the foot of the card', async () => {
      fixture.componentRef.setInput('newTabHint', hint);
      fixture.componentRef.setInput('links', [
        { label: 'Live site', href: 'https://example.com/', newTab: true },
        { label: 'Case study', href: '#projects', newTab: false },
      ]);
      await fixture.whenStable();

      expect(links().map((a) => a.getAttribute('href'))).toEqual([
        'https://example.com/',
        '#projects',
      ]);
      expect(host.querySelector('article > :last-child')?.classList).toContain('card__links');
    });

    it('opens external links in a new tab, safely, and says so to assistive tech', async () => {
      fixture.componentRef.setInput('newTabHint', hint);
      fixture.componentRef.setInput('links', [
        { label: 'Live site', href: 'https://example.com/', newTab: true },
        { label: 'Case study', href: '#projects', newTab: false },
      ]);
      await fixture.whenStable();

      const [external, internal] = links();

      expect(external.getAttribute('target')).toBe('_blank');
      expect(external.getAttribute('rel')).toBe('noopener noreferrer');
      expect(text(external)).toBe(`Live site ${hint}`);
      expect(internal.hasAttribute('target')).toBeFalse();
      expect(internal.hasAttribute('rel')).toBeFalse();
      expect(text(internal)).toBe('Case study');
    });
  });
});
