import { ChangeDetectionStrategy, Component, input } from '@angular/core';

let instances = 0;

/** The user-flow UFO mark as inline SVG. Outline and body colours follow the theme. */
@Component({
  selector: 'docs-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.aria-hidden]': 'label() ? null : true',
    '[attr.role]': "label() ? 'img' : null",
    '[attr.aria-label]': 'label()',
  },
  template: `
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      focusable="false"
    >
      <defs>
        <clipPath [attr.id]="clipId">
          <path d="M42 124 A54 54 0 0 1 150 124 Z" />
        </clipPath>
      </defs>
      <g
        transform="rotate(-22 100 112)"
        fill="none"
        stroke="var(--logo-outline)"
        stroke-width="5.5"
        stroke-linejoin="round"
        stroke-linecap="round"
      >
        <line x1="64" y1="82" x2="52" y2="52" />
        <circle cx="50" cy="47" r="5" fill="var(--logo-outline)" />
        <path d="M42 124 A54 54 0 0 1 150 124 Z" fill="#3659e3" stroke="none" />
        <g [attr.clip-path]="'url(#' + clipId + ')'" stroke="none">
          <circle cx="60" cy="104" r="2" fill="#fff" />
          <circle cx="76" cy="86" r="1.6" fill="#fff" />
          <circle cx="134" cy="94" r="2" fill="#fff" />
          <circle cx="122" cy="112" r="1.4" fill="#fff" />
          <circle cx="52" cy="118" r="1.4" fill="#fff" />
          <circle cx="142" cy="114" r="1.5" fill="#fff" />
          <circle cx="110" cy="80" r="1.3" fill="#fff" />
          <circle cx="130" cy="78" r="1.2" fill="#fff" />
          <path d="M96 80 L22 50 L22 98 Z" fill="#fcd34d" opacity="0.8" />
          <path d="M42 126 Q96 108 150 126 L150 134 L42 134 Z" fill="#22c55e" />
          <path d="M85 126 L91 82 L101 82 L107 126 Z" fill="#fff" />
          <path
            d="M90.2 89 L101.8 89 L102.7 96.5 L89.3 96.5 Z"
            fill="#ff003c"
          />
          <path
            d="M88.3 104 L103.7 104 L104.6 111.5 L87.4 111.5 Z"
            fill="#ff003c"
          />
          <path
            d="M86.4 119 L105.6 119 L106.5 126 L85.5 126 Z"
            fill="#ff003c"
          />
          <rect x="89" y="74" width="14" height="8" fill="#fcd34d" />
          <path d="M86 74 L96 65 L106 74 Z" fill="#ff003c" />
          <path
            d="M85 126 L91 82 L101 82 L107 126"
            stroke="var(--logo-outline)"
            stroke-width="2.5"
            fill="none"
          />
        </g>
        <path d="M42 124 A54 54 0 0 1 150 124" />
        <ellipse cx="100" cy="134" rx="94" ry="22" fill="var(--logo-body)" />
        <circle cx="54" cy="136" r="5.5" fill="var(--logo-body)" />
        <circle cx="100" cy="145" r="5.5" fill="var(--logo-body)" />
        <circle cx="146" cy="136" r="5.5" fill="var(--logo-body)" />
        <path d="M56 152 A50 15 0 0 0 154 149" />
      </g>
    </svg>
  `,
  styles: `
    :host {
      display: inline-block;
      width: 2rem;
      height: 2rem;
      --logo-outline: var(--text-heading);
      --logo-body: var(--surface-raised);
    }
    svg {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
})
export class Logo {
  /** Accessible name; omit for a purely decorative mark. */
  readonly label = input<string>();
  readonly clipId = `docs-logo-dome-${++instances}`;
}
