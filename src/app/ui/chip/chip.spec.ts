import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chip } from './chip';

describe('Chip', () => {
  let fixture: ComponentFixture<Chip>;

  const chip = () => fixture.nativeElement.querySelector('.chip') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chip],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Chip);
    await fixture.whenStable();
  });

  it('is a plain accent tag by default', () => {
    expect(chip().classList).not.toContain('chip--cta');
  });

  it('switches to the cta status style', async () => {
    fixture.componentRef.setInput('variant', 'cta');
    await fixture.whenStable();

    expect(chip().classList).toContain('chip--cta');
  });
});
