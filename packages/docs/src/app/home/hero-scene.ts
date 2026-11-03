import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The hero illustration: the user-flow saucer hovers over the three kinds of
 * step a flow is made of, pausing above each one while its ring fills.
 *
 * The animation is pure CSS so the server and the client render the same
 * markup, and it stops under `prefers-reduced-motion`.
 */
@Component({
  selector: 'docs-hero-scene',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero-scene.html',
  styleUrl: './hero-scene.scss',
  host: {
    role: 'img',
    'aria-label':
      'The user-flow saucer hovering over a navigation, a timespan and a snapshot step, measuring each in turn.',
  },
})
export class HeroScene {
  readonly targets = [
    { label: 'Navigation', note: 'Page load', icon: 'navigation' },
    { label: 'Timespan', note: 'Interaction', icon: 'timespan' },
    { label: 'Snapshot', note: 'Page state', icon: 'snapshot' },
  ] as const;
}
