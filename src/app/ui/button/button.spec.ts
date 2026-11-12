import {
  ChangeDetectionStrategy,
  Component,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Button, ButtonSize, ButtonVariant } from './button';

@Component({
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-button
    [href]="href()"
    [variant]="variant()"
    [size]="size()"
    [download]="download()"
    >Label</app-button
  >`,
})
class Host {
  readonly href = signal('#projects');
  readonly variant = signal<ButtonVariant>('cta');
  readonly size = signal<ButtonSize>('md');
  readonly download = signal(false);
}

describe('Button', () => {
  let fixture: ComponentFixture<Host>;

  const link = () => fixture.nativeElement.querySelector('a') as HTMLAnchorElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
  });

  it('renders a real link with the projected label', () => {
    expect(link().getAttribute('href')).toBe('#projects');
    expect(link().textContent?.trim()).toBe('Label');
  });

  it('defaults to the cta variant at md size', () => {
    expect(link().className).toContain('button');
    expect(link().classList).toContain('button--cta');
    expect(link().classList).toContain('button--md');
  });

  it('applies the requested variant and size', async () => {
    fixture.componentInstance.variant.set('outline');
    fixture.componentInstance.size.set('sm');
    await fixture.whenStable();

    expect(link().classList).toContain('button');
    expect(link().classList).toContain('button--outline');
    expect(link().classList).toContain('button--sm');
    expect(link().classList).not.toContain('button--cta');
  });

  it('only sets download when asked', async () => {
    expect(link().hasAttribute('download')).toBeFalse();

    fixture.componentInstance.download.set(true);
    await fixture.whenStable();

    expect(link().hasAttribute('download')).toBeTrue();
  });
});
