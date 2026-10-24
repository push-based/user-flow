import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
import { Logo } from './shared/logo';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Logo],
  selector: 'docs-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly nav = DOCS_NAV;
  readonly menuOpen = signal(false);
  readonly isDocs = signal(false);

  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private static readonly THEME_KEY = 'user-flow-docs-theme';

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

  /** Switches between light and dark, starting from whatever the system or a stored choice currently shows. */
  toggleTheme() {
    if (!this.isBrowser) {
      return;
    }
    const root = this.document.documentElement;
    const stored = root.getAttribute('data-theme');
    const systemDark =
      this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)')
        .matches ?? false;
    const currentDark = stored ? stored === 'dark' : systemDark;
    const next = currentDark ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem(App.THEME_KEY, next);
    } catch {
      // storage can be unavailable in private windows; the choice then lasts for this page view only
    }
  }
}
