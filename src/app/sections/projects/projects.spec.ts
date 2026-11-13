import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DEFAULT_LOCALE, SITE_CONTENT } from '../../core/content/site-content';
import { Projects } from './projects';

describe('Projects', () => {
  const content = SITE_CONTENT[DEFAULT_LOCALE].projects;
  let host: HTMLElement;

  const cardsIn = (list: Element) => Array.from(list.querySelectorAll('li > app-card'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Projects],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(Projects);
    await fixture.whenStable();
    host = fixture.nativeElement;
  });

  it('names the section after its h2', () => {
    const h2 = host.querySelector('h2');

    expect(h2?.textContent?.trim()).toBe(content.heading.title);
    expect(host.querySelector('section')?.getAttribute('aria-labelledby')).toBe(h2?.id ?? '');
  });

  it('lists the selected work as h3 cards, without a status', () => {
    const [selected] = Array.from(host.querySelectorAll('.projects__grid'));
    const cards = cardsIn(selected);

    expect(cards.map((c) => c.querySelector('h3')?.textContent?.trim())).toEqual(
      content.selected.map((p) => p.heading),
    );
    expect(selected.querySelector('.card--cta, .chip--cta')).toBeNull();
  });

  it('heads "Building now" with an h3 and nests its cards one level below', () => {
    const [, building] = Array.from(host.querySelectorAll('.projects__grid'));
    const cards = cardsIn(building);
    const subtitle = host.querySelector('h3.projects__subtitle');

    expect(subtitle?.textContent).toContain(content.buildingNow.title);
    expect(subtitle?.querySelector('[aria-hidden="true"]')?.textContent).toBe('/');
    expect(cards.map((c) => c.querySelector('h4')?.textContent?.trim())).toEqual(
      content.buildingNow.projects.map((p) => p.heading),
    );
  });

  it('marks every "Building now" card with the status chip first', () => {
    const [, building] = Array.from(host.querySelectorAll('.projects__grid'));

    for (const card of cardsIn(building)) {
      expect(card.querySelector('.card')?.classList).toContain('card--cta');
      expect(card.querySelector('.chip')?.textContent?.trim()).toBe(content.buildingNow.status);
    }
  });

  it('gives each card the links of its project, external ones in a new tab', () => {
    const projects = [...content.selected, ...content.buildingNow.projects];
    const cards = Array.from(host.querySelectorAll('app-card'));

    expect(cards.length).toBe(projects.length);
    for (const [i, project] of projects.entries()) {
      const anchors = Array.from(cards[i].querySelectorAll<HTMLAnchorElement>('.card__link'));
      const links = project.links ?? [];

      expect(anchors.map((a) => a.getAttribute('href')))
        .withContext(project.heading)
        .toEqual(links.map((l) => l.href));
      expect(anchors.map((a) => a.getAttribute('target')))
        .withContext(project.heading)
        .toEqual(links.map((l) => (l.newTab ? '_blank' : null)));
    }
  });

  it('has no placeholder copy left', () => {
    expect(host.textContent).not.toContain('[TODO]');
  });
});
