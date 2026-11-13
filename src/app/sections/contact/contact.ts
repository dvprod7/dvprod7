import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DEFAULT_LOCALE, SITE_CONTENT } from '../../core/content/site-content';
import { Button } from '../../ui/button/button';
import { CopyPill } from '../../ui/copy-pill/copy-pill';
import { SocialLinks } from '../../ui/social-links/social-links';

// Direct links only: there is no contact form in V3. Email is a copy-to-
// clipboard pill here (QA 5e), so the social pills skip it. The footer (its
// own component, outside <main>) follows right after, so this section has no
// bottom padding.
@Component({
  selector: 'app-contact',
  imports: [Button, CopyPill, SocialLinks],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  protected readonly content = SITE_CONTENT[DEFAULT_LOCALE].contact;
  protected readonly socialLinks = SITE_CONTENT[DEFAULT_LOCALE].socialLinks.filter(
    (link) => link.id !== 'email',
  );
  protected readonly newTabHint = SITE_CONTENT[DEFAULT_LOCALE].a11y.newTabHint;
}
