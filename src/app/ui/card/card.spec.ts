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
});
