import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DEFAULT_LOCALE, SITE_CONTENT } from '../../core/content/site-content';
import { Button } from '../../ui/button/button';
import { SocialLinks } from '../../ui/social-links/social-links';

@Component({
  selector: 'app-hero',
  imports: [Button, SocialLinks],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  protected readonly content = SITE_CONTENT[DEFAULT_LOCALE].hero;
  protected readonly socialLinks = SITE_CONTENT[DEFAULT_LOCALE].socialLinks;
  protected readonly newTabHint = SITE_CONTENT[DEFAULT_LOCALE].a11y.newTabHint;
}
