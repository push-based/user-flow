import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type Mode = 'navigation' | 'timespan' | 'snapshot';

/** The Lighthouse icon for a measurement mode: a ring, a clock or a snapshot shutter. */
@Component({
  selector: 'docs-mode-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  styles: `
    :host {
      display: inline-block;
      width: 1em;
      height: 1em;
      flex: none;
    }
    svg {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      @switch (mode()) { @case ('timespan') {
      <path d="M12 7v5l3.5 2" />
      } @case ('snapshot') {
      <path
        d="m14.3 8 5.2 9M9.7 8h10.4M7.4 12l5.2-9M9.7 16 4.5 7M14.3 16H3.9M16.6 12l-5.2 9"
      />
      } }
    </svg>
  `,
})
export class ModeIcon {
  readonly mode = input.required<Mode>();
}
