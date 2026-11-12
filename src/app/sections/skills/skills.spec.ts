import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DEFAULT_LOCALE, SITE_CONTENT } from '../../core/content/site-content';
import { Skills } from './skills';

describe('Skills', () => {
  const content = SITE_CONTENT[DEFAULT_LOCALE].skills;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Skills],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(Skills);
    await fixture.whenStable();
    host = fixture.nativeElement;
  });

  it('names the section after its h2', () => {
    const h2 = host.querySelector('h2');

    expect(h2?.textContent?.trim()).toBe(content.heading.title);
    expect(host.querySelector('section')?.getAttribute('aria-labelledby')).toBe(h2?.id ?? '');
  });

  it('hides the eyebrow slash from assistive tech', () => {
    const eyebrow = host.querySelector('.skills__eyebrow');

    expect(eyebrow?.querySelector('[aria-hidden="true"]')?.textContent).toBe('/');
    expect(eyebrow?.textContent).toContain(content.heading.eyebrow);
  });

  it('renders every group as an h3 and a list, in content order', () => {
    const groups = Array.from(host.querySelectorAll('.skills__group'));

    expect(groups.map((g) => g.querySelector('h3')?.textContent?.trim())).toEqual(
      content.groups.map((g) => g.title),
    );
    expect(
      groups.map((g) => Array.from(g.querySelectorAll('li'), (li) => li.textContent?.trim())),
    ).toEqual(content.groups.map((g) => [...g.items]));
  });

  it('has no images or icons: the section is plain text', () => {
    expect(host.querySelector('img, svg, app-icon')).toBeNull();
  });
});
