import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SocialLink } from '../../core/content/site-content';
import { Icon } from '../icon/icon';

// icon: round accent pills with an icon (hero, mobile menu) · pill: outlined
// text pills (Contact). Same links, same order, either way.
export type SocialLinksVariant = 'icon' | 'pill';

@Component({
  selector: 'app-social-links',
  imports: [Icon],
  templateUrl: './social-links.html',
  styleUrl: './social-links.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialLinks {
  readonly links = input.required<readonly SocialLink[]>();
  readonly variant = input<SocialLinksVariant>('icon');
}
