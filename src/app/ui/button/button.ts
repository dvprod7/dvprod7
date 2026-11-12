import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

// cta: orange fill (View Projects, Download CV) · outline: accent border on
// the inverse surface (Hire me) · accent: yellow fill (Say hello).
export type ButtonVariant = 'cta' | 'outline' | 'accent';

// md: hero buttons · sm: Download CV, Say hello. Only the type size changes.
export type ButtonSize = 'md' | 'sm';

// Every button in the design leads somewhere (an anchor, the CV, mailto), so
// this renders a real link. The label is projected from the consumer.
@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  readonly href = input.required<string>();
  readonly variant = input<ButtonVariant>('cta');
  readonly size = input<ButtonSize>('md');
  // Saves the target instead of opening it (the CV).
  readonly download = input(false);

  protected readonly modifiers = computed(() => [
    `button--${this.variant()}`,
    `button--${this.size()}`,
  ]);
}
