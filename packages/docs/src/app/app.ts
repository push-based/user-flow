import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { DOCS_NAV } from './docs/nav';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'docs-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly nav = DOCS_NAV;
  readonly menuOpen = signal(false);
  readonly isDocs = signal(false);

  constructor() {
    const router = inject(Router);
    this.isDocs.set(router.url.startsWith('/docs'));
    router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((e) => {
        this.isDocs.set(e.urlAfterRedirects.startsWith('/docs'));
        this.menuOpen.set(false);
      });
  }

  toggleMenu() {
    this.menuOpen.update((open) => !open);
  }
}
