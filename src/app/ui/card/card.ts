import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Chip } from '../chip/chip';

// Project card, shared by "Selected work" and "Building now": the only
// difference is the optional status, shown as a cta chip before the tags and
// as an orange border. Knows nothing about where its data comes from.
@Component({
  selector: 'app-card',
  imports: [Chip],
  templateUrl: './card.html',
  styleUrl: './card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  readonly heading = input.required<string>();
  readonly description = input.required<string>();
  // Unique within a card: they double as the @for track key.
  readonly tags = input<readonly string[]>([]);
  readonly status = input<string>();
  // Follows the outline of the page: 4 when the cards sit under an h3.
  readonly headingLevel = input<3 | 4>(3);
}
