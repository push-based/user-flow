import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { SearchOpener } from './search/search-opener';

/** A few pages most visitors are after, offered when a link went nowhere. */
const POPULAR = [
  {
    path: '/docs/getting-started/quick-start',
    title: 'Quick start',
    body: 'Initialise a config and run your first flow.',
  },
  {
    path: '/docs/cli/collect',
    title: 'collect command',
    body: 'Run flows and pick report formats.',
  },
  {
    path: '/docs/integrations/github-workflow',
    title: 'GitHub workflow',
    body: 'A report on every pull request.',
  },
];

@Component({
  selector: 'docs-not-found',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="not-found">
      <div class="copy">
        <p class="text-subtitle eyebrow enter" style="--enter: 0">
          404 · Signal lost
        </p>
        <h1 class="enter" style="--enter: 1">This page drifted out of orbit</h1>
        <p class="lead enter" style="--enter: 2">
          The link may be outdated or mistyped. Search the docs, or pick up from
          one of the pages most people are looking for.
        </p>
        <div class="actions enter" style="--enter: 3">
          <button
            class="pb-btn pb-btn-primary"
            type="button"
            (click)="search.open()"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            Search the docs
          </button>
          <a class="pb-btn pb-btn-ghost" routerLink="/"
            >Back to the start page</a
          >
        </div>
        <ul class="popular enter" style="--enter: 4">
          @for (page of popular; track page.path) {
            <li>
              <a class="section-card popular-card" [routerLink]="page.path">
                <span class="popular-title">
                  {{ page.title }}
                  <span class="pb-arrow" aria-hidden="true">→</span>
                </span>
                <span class="popular-body">{{ page.body }}</span>
              </a>
            </li>
          }
        </ul>
      </div>

      <!-- The UFO sweeps its beam across the ground, looking for the page. -->
      <div class="scene enter" style="--enter: 2" aria-hidden="true">
        <span class="star" style="--x: 12%; --y: 18%; --d: 0s"></span>
        <span class="star" style="--x: 78%; --y: 10%; --d: 0.8s"></span>
        <span class="star" style="--x: 88%; --y: 46%; --d: 1.6s"></span>
        <span class="star" style="--x: 22%; --y: 58%; --d: 2.2s"></span>
        <span class="star" style="--x: 55%; --y: 6%; --d: 1.2s"></span>
        <div class="ufo">
          <svg class="uf-mark ufo-mark" viewBox="0 0 1360 1360">
            <use href="images/user-flow-mark.svg#mark" />
          </svg>
          <div class="beam"></div>
        </div>
        <div class="ground">
          <span class="lost">404</span>
        </div>
      </div>
    </section>
  `,
  styles: `
    .not-found {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: var(--space-10);
      align-items: center;
      padding: var(--space-12) 0 var(--space-16);
    }

    @media (min-width: 900px) {
      .not-found {
        grid-template-columns: minmax(0, 1fr) 360px;
        gap: var(--space-16);
      }
    }

    .eyebrow {
      margin: 0 0 var(--space-4);
      color: var(--link);
    }

    h1 {
      margin: 0;
      max-width: 36rem;
      font-size: 2.25rem;
      line-height: 2.5rem;
      font-weight: 600;
      letter-spacing: -0.02em;
      color: var(--text-heading);
    }

    @media (min-width: 768px) {
      h1 {
        font-size: 3rem;
        line-height: 1.1;
      }
    }

    .lead {
      margin: var(--space-6) 0 0;
      max-width: 34rem;
      font-size: 1.125rem;
      line-height: 1.75rem;
      color: var(--text-muted);
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3);
      margin-top: var(--space-8);

      svg {
        width: 1rem;
        height: 1rem;
      }
    }

    .pb-btn-primary {
      gap: var(--space-2);
    }

    .popular {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 12rem), 1fr));
      gap: var(--space-3);
      margin: var(--space-10) 0 0;
      padding: 0;
      list-style: none;
    }

    .popular-card {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      height: 100%;
      padding: var(--space-4);
      text-decoration: none;
    }

    .popular-title {
      display: flex;
      justify-content: space-between;
      font-weight: 600;
      color: var(--text-heading);
    }

    .popular-card .pb-arrow {
      color: var(--text-subtle);
      transition:
        translate var(--duration-base) var(--ease-out),
        color var(--duration-base) ease-out;
    }

    .popular-card:hover .pb-arrow {
      color: var(--link);
      translate: 3px 0;
    }

    .popular-body {
      font-size: 0.875rem;
      line-height: 1.25rem;
      color: var(--text-muted);
    }

    // On phones the scene comes first, a little shorter.
    @media (max-width: 899px) {
      .not-found .scene {
        order: -1;
        height: 220px;
      }
    }

    .scene {
      position: relative;
      height: 300px;
      border: 1px solid var(--border);
      border-radius: var(--radius-xl, 1rem);
      background:
        radial-gradient(
          circle at 50% 120%,
          var(--accent-soft),
          transparent 60%
        ),
        var(--surface-subtle);
      overflow: hidden;
    }

    .star {
      position: absolute;
      left: var(--x);
      top: var(--y);
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: var(--text-subtle);
      animation: twinkle 3s ease-in-out var(--d) infinite;
    }

    .ufo {
      position: absolute;
      top: 28px;
      left: 50%;
      width: 96px;
      margin-left: -48px;
      animation: hover 5s ease-in-out infinite;
    }

    .ufo-mark {
      position: relative;
      z-index: 1;
      display: block;
      width: 96px;
      height: 96px;
      animation: bob 2.4s ease-in-out infinite;
    }

    .beam {
      position: absolute;
      top: 70px;
      left: 50%;
      width: 150px;
      height: 190px;
      margin-left: -75px;
      background: linear-gradient(
        to bottom,
        color-mix(in srgb, var(--accent) 45%, transparent),
        transparent
      );
      clip-path: polygon(42% 0, 58% 0, 100% 100%, 0 100%);
      transform-origin: top center;
      animation: sweep 5s ease-in-out infinite;
    }

    .ground {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 56px;
      border-top: 1px dashed var(--border-strong);
      display: grid;
      place-items: center;
    }

    .lost {
      font-family: var(--font-mono);
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: 0.3em;
      color: var(--text-subtle);
      animation: flicker 5s ease-in-out infinite;
    }

    @keyframes bob {
      50% {
        translate: 0 -6px;
      }
    }

    @keyframes hover {
      0%,
      100% {
        translate: -40px 0;
        rotate: -4deg;
      }
      50% {
        translate: 40px 0;
        rotate: 4deg;
      }
    }

    @keyframes sweep {
      0%,
      100% {
        rotate: 10deg;
      }
      50% {
        rotate: -10deg;
      }
    }

    @keyframes twinkle {
      50% {
        opacity: 0.2;
        scale: 0.6;
      }
    }

    // The 404 lights up whenever the beam passes over it.
    @keyframes flicker {
      0%,
      30%,
      70%,
      100% {
        color: var(--text-subtle);
      }
      50% {
        color: var(--link);
      }
    }
  `,
})
export class NotFound {
  protected readonly search = inject(SearchOpener);
  protected readonly popular = POPULAR;

  constructor() {
    inject(Title).setTitle('Page not found · user-flow');
  }
}
