import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';

import { Icon } from '../icon/icon';

// How long "Copied" stays up after a copy.
const COPIED_MS = 2000;

// A text pill that copies a value (the email address on Contact). At rest it
// shows its label; on hover or keyboard focus it widens to reveal the value.
// Clicking (or tapping, which also expands it) copies the value and shows the
// copied label for a moment, announced through a polite live region. Without a
// usable clipboard it follows the fallback link instead (mailto).
// Prerender-safe: the clipboard, location and the timer are only touched from
// the click handler, never while rendering.
@Component({
  selector: 'app-copy-pill',
  imports: [Icon],
  templateUrl: './copy-pill.html',
  styleUrl: './copy-pill.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyPill {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly fallbackHref = input.required<string>();
  // Accessible name of the button. It should contain the visible label.
  readonly actionLabel = input.required<string>();
  readonly copiedLabel = input.required<string>();
  readonly copiedAnnouncement = input.required<string>();

  protected readonly copied = signal(false);

  // Timer handle only, not view state.
  private resetTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.resetTimer));
  }

  protected async copy(): Promise<void> {
    // Typed as always there, but missing outside secure contexts.
    const clipboard = navigator.clipboard as Clipboard | undefined;

    try {
      if (!clipboard) {
        throw new Error('Clipboard API unavailable');
      }
      await clipboard.writeText(this.value());
    } catch {
      this.openFallback();
      return;
    }

    this.copied.set(true);
    clearTimeout(this.resetTimer);
    this.resetTimer = setTimeout(() => this.copied.set(false), COPIED_MS);
  }

  // Its own method so specs can stub the navigation.
  protected openFallback(): void {
    location.assign(this.fallbackHref());
  }
}
