import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DEFAULT_LOCALE, SITE_CONTENT } from '../../core/content/site-content';
import { Button } from '../../ui/button/button';

@Component({
  selector: 'app-about',
  imports: [Button],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  protected readonly content = SITE_CONTENT[DEFAULT_LOCALE].about;
}
