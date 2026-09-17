import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DEFAULT_LOCALE, SITE_CONTENT } from '../../core/content/site-content';
import { Logo } from '../../ui/logo/logo';

@Component({
  selector: 'app-footer',
  imports: [Logo],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly content = SITE_CONTENT[DEFAULT_LOCALE].shell.footer;
}
