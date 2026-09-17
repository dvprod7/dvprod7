import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import { DEFAULT_LOCALE, LANGUAGE_SWITCH, SITE_CONTENT } from '../../core/content/site-content';
import { BREAKPOINT_LG } from '../../core/models/breakpoints';
import { Logo } from '../../ui/logo/logo';

@Component({
  selector: 'app-nav',
  imports: [Logo],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Nav {
  private readonly destroyRef = inject(DestroyRef);
  private readonly menu = viewChild.required<ElementRef<HTMLDialogElement>>('menu');

  protected readonly content = SITE_CONTENT[DEFAULT_LOCALE].shell;
  protected readonly languageSwitch = LANGUAGE_SWITCH;
  protected readonly isMenuOpen = signal(false);
  // Resolved when the page renders: at build time once the site is prerendered.
  protected readonly year = new Date().getFullYear();

  constructor() {
    // Browser only: matchMedia does not exist while prerendering.
    afterNextRender(() => {
      const desktop = matchMedia(`(min-width: ${BREAKPOINT_LG}px)`);
      const closeOnDesktop = (event: MediaQueryListEvent) => {
        if (event.matches) {
          this.closeMenu();
        }
      };

      desktop.addEventListener('change', closeOnDesktop);
      this.destroyRef.onDestroy(() => desktop.removeEventListener('change', closeOnDesktop));
    });
  }

  protected openMenu(): void {
    this.menu().nativeElement.showModal();
    this.isMenuOpen.set(true);
  }

  // Closing from a link runs before the browser follows the anchor, so the
  // scroll lock is already gone when it scrolls.
  protected closeMenu(): void {
    const dialog = this.menu().nativeElement;

    if (dialog.open) {
      dialog.close();
    }
  }

  // Fires for every close, including Escape, which never reaches closeMenu().
  protected onMenuClose(): void {
    this.isMenuOpen.set(false);
  }
}
