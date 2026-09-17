import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { LogoContent } from '../../core/content/site-content';

// Renders `</dvprod7>` with the brackets hidden from assistive tech, so the
// accessible name is just the product name. Styling belongs to the consumer.
@Component({
  selector: 'app-logo',
  templateUrl: './logo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Logo {
  readonly logo = input.required<LogoContent>();
}
