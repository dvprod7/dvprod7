import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DEFAULT_LOCALE, LANGUAGE_SWITCH, SITE_CONTENT } from '../../core/content/site-content';
import { Logo } from '../../ui/logo/logo';

@Component({
  selector: 'app-nav',
  imports: [Logo],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Nav {
  protected readonly content = SITE_CONTENT[DEFAULT_LOCALE].shell;
  protected readonly languageSwitch = LANGUAGE_SWITCH;
}
