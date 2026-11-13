import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CardLink } from '../../core/content/site-content';
import { Chip } from '../chip/chip';

// Project card, shared by "Selected work" and "Building now": the only
// difference is the optional status, shown as a cta chip before the tags and
// as an orange border. Optional links sit at the foot of the card. Knows
// nothing about where its data comes from.
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
  // Labels are unique within a card (the @for track key).
  readonly links = input<readonly CardLink[]>([]);
  // Copy for links that open a new tab, read by assistive tech only. Same
  // contract as ui/social-links: the consumer passes it from the content layer.
  readonly newTabHint = input('');
}
