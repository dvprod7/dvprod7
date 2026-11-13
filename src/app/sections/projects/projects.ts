import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DEFAULT_LOCALE, SITE_CONTENT } from '../../core/content/site-content';
import { Card } from '../../ui/card/card';

// "Selected work" and "Building now": two grids of the same ui/card. Cards are
// text only, with no links or images, and no detail page.
@Component({
  selector: 'app-projects',
  imports: [Card],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects {
  protected readonly content = SITE_CONTENT[DEFAULT_LOCALE].projects;
}
