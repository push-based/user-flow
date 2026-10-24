import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'docs-not-found',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="not-found">
      <p class="text-subtitle">404</p>
      <h1>This page does not exist</h1>
      <p>
        The link may be outdated. Start from the documentation overview instead.
      </p>
      <a class="pb-btn pb-btn-primary" routerLink="/">Back to the start page</a>
    </section>
  `,
  styles: `
    .not-found {
      padding: var(--space-16) 0;
      max-width: 36rem;
    }
    h1 {
      margin: var(--space-3) 0;
      font-size: 2rem;
      line-height: 2.5rem;
      color: var(--color-text-heading);
    }
    p {
      margin: 0 0 var(--space-6);
      color: var(--color-text-muted);
    }
  `,
})
export class NotFound {}
