import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DEFAULT_LOCALE, SITE_CONTENT } from '../../core/content/site-content';

// Plain text by design: no icons, no carousel, no cards.
@Component({
  selector: 'app-skills',
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Skills {
  protected readonly content = SITE_CONTENT[DEFAULT_LOCALE].skills;
}
