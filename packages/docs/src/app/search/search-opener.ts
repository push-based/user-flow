import { Injectable, signal } from '@angular/core';

/**
 * Lets any page open the search dialog, which lives in the app shell.
 * Each call to `open()` bumps a counter the shell reacts to.
 */
@Injectable({ providedIn: 'root' })
export class SearchOpener {
  readonly requests = signal(0);

  open() {
    this.requests.update((n) => n + 1);
  }
}
