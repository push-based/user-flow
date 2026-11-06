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
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
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
  /** True while a route is resolving, so the progress bar under the header can show. */
  readonly navigating = signal(false);

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
    router.events.pipe(takeUntilDestroyed()).subscribe((e) => {
      if (e instanceof NavigationStart) {
        this.navigating.set(true);
      } else if (
        e instanceof NavigationEnd ||
        e instanceof NavigationCancel ||
        e instanceof NavigationError
      ) {
        this.navigating.set(false);
      }
    });
  }

  toggleMenu() {
    this.menuOpen.update((open) => !open);
  }

  /**
   * Switches between light and dark, starting from whatever the system or a
   * stored choice currently shows. Where the browser supports view
   * transitions the new theme spreads out from the toggle button.
   */
  toggleTheme(event?: MouseEvent) {
    if (!this.isBrowser) {
      return;
    }
    const root = this.document.documentElement;
    const apply = () => this.applyTheme(root);
    const reduced = this.document.defaultView?.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (!this.document.startViewTransition || reduced) {
      apply();
      return;
    }
    const button = (event?.currentTarget as HTMLElement | null) ?? null;
    const rect = button?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : innerWidth - 32;
    const y = rect ? rect.top + rect.height / 2 : 32;
    const radius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    );
    root.style.setProperty('--theme-x', `${x}px`);
    root.style.setProperty('--theme-y', `${y}px`);
    root.style.setProperty('--theme-r', `${radius}px`);
    root.setAttribute('data-theme-switching', '');
    const transition = this.document.startViewTransition(apply);
    transition.finished.finally(() =>
      root.removeAttribute('data-theme-switching'),
    );
  }

  private applyTheme(root: HTMLElement) {
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
