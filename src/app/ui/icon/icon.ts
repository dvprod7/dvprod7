import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ICON_SPRITE, IconName } from '../../core/models/icon';

// One symbol from the sprite. Always decorative: the accessible name belongs
// to the link or button that holds the icon. Sized in em, so it follows the
// surrounding text unless the consumer sets its size.
@Component({
  selector: 'app-icon',
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  readonly name = input.required<IconName>();

  protected readonly href = computed(() => `${ICON_SPRITE}#${this.name()}`);
}
