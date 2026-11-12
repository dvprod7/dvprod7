import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ICON_NAMES, ICON_SPRITE } from '../../core/models/icon';
import { Icon } from './icon';

describe('Icon', () => {
  let fixture: ComponentFixture<Icon>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Icon],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Icon);
    fixture.componentRef.setInput('name', 'github');
    await fixture.whenStable();
    host = fixture.nativeElement;
  });

  it('points at the symbol in the sprite', () => {
    expect(host.querySelector('use')?.getAttribute('href')).toBe(`${ICON_SPRITE}#github`);
  });

  it('is hidden from assistive tech and never takes focus', () => {
    const svg = host.querySelector('svg');

    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.getAttribute('focusable')).toBe('false');
  });

  it('declares its own inline display instead of the block one from the reset', () => {
    expect(getComputedStyle(host).display).toBe('inline-block');
  });

  it('follows a name change', async () => {
    fixture.componentRef.setInput('name', 'linkedin');
    await fixture.whenStable();

    expect(host.querySelector('use')?.getAttribute('href')).toBe(`${ICON_SPRITE}#linkedin`);
  });
});

describe('Icon sprite', () => {
  it('has a symbol for every icon name', async () => {
    const response = await fetch(ICON_SPRITE);

    expect(response.ok).withContext(`GET ${ICON_SPRITE}`).toBeTrue();

    const sprite = new DOMParser().parseFromString(await response.text(), 'image/svg+xml');
    for (const name of ICON_NAMES) {
      expect(sprite.querySelector(`symbol[id="${name}"]`))
        .withContext(name)
        .not.toBeNull();
    }
  });
});
