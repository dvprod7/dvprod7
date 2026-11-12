import { ChangeDetectionStrategy, Component, input } from '@angular/core';

// default: accent tag · cta: the orange "Building now" status.
export type ChipVariant = 'default' | 'cta';

// A small label. Not interactive: it is never a link or a filter.
@Component({
  selector: 'app-chip',
  templateUrl: './chip.html',
  styleUrl: './chip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Chip {
  readonly variant = input<ChipVariant>('default');
}
