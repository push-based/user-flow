import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The hero illustration: the user-flow saucer hovers over the three kinds of
 * step a flow is made of, pausing above each one while its ring fills, and
 * leaves a score behind. Orbit rings and a glow float behind it, and the
 * whole scene tilts with the pointer through the `--px`/`--py` variables set
 * by the `docsTilt` directive on the hero.
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
    { label: 'Navigation', note: 'Page load', icon: 'navigation', score: '92' },
    { label: 'Timespan', note: 'Interaction', icon: 'timespan', score: '9/10' },
    { label: 'Snapshot', note: 'Page state', icon: 'snapshot', score: '18/19' },
  ] as const;

  /** Floating specks of light in the glow, each with its own drift. */
  readonly motes = [
    { x: 14, y: 28, s: 1.4, d: 0 },
    { x: 78, y: 18, s: 1, d: 1.3 },
    { x: 90, y: 56, s: 1.8, d: 2.1 },
    { x: 6, y: 62, s: 1.1, d: 0.7 },
    { x: 52, y: 10, s: 0.9, d: 2.8 },
    { x: 34, y: 74, s: 1.3, d: 1.9 },
  ];
}
