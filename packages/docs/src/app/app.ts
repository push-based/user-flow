import {
  afterNextRender,
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  PLATFORM_ID,
  signal,
  untracked,
  viewChild,
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

/** Icon paths (24px grid, stroked) for each docs section in the sidebar. */
const SECTION_ICONS: Record<string, string[]> = {
  // Rocket
  'getting-started': [
    'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z',
    'm12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z',
    'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0',
    'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5',
  ],
  // Terminal
  cli: ['m4 17 6-6-6-6', 'M12 19h8'],
  // Route
  'user-flows': [
    'M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    'M9 17h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15',
    'M18 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  ],
  // Plug
  integrations: [
    'M12 22v-5',
    'M9 8V2',
    'M15 8V2',
    'M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z',
  ],
  // Book
  resources: ['M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20'],
};
import { Search } from './search/search';
import { SearchOpener } from './search/search-opener';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Search],
  selector: 'docs-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss',
  host: {
    '(document:keydown)': 'onKeydown($event)',
    '(window:resize)': 'measureDrawerMode()',
  },
})
export class App {
  readonly nav = DOCS_NAV;
  readonly sectionIcons = SECTION_ICONS;

  /** Sidebar sections the reader folded away. The current section always stays open. */
  readonly collapsed = signal<ReadonlySet<string>>(new Set());

  /** Position of the pill that slides to the current page in the sidebar. */
  readonly sidebarMarker = signal<{
    top: number;
    height: number;
    /** False while it follows a layout change, so it tracks the link instead of easing behind it. */
    slide: boolean;
  } | null>(null);

  private readonly sidebarNav =
    viewChild<ElementRef<HTMLElement>>('sidebarNav');
  readonly menuOpen = signal(false);
  readonly isDocs = signal(false);
  /** "⌘K" on Apple platforms, "Ctrl K" elsewhere; set in the browser once it is known. */
  readonly shortcutLabel = signal('⌘K');
  /** Below 900px the docs sidebar is an off-canvas drawer. */
  readonly drawerMode = signal(false);

  private readonly search = viewChild.required(Search);

  /** True while a route is resolving, so the progress bar under the header can show. */
  readonly navigating = signal(false);

  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private static readonly THEME_KEY = 'user-flow-docs-theme';

  constructor() {
    afterNextRender(() => {
      const platform =
        (navigator as Navigator & { userAgentData?: { platform: string } })
          .userAgentData?.platform ?? navigator.platform;
      if (!/mac|iphone|ipad/i.test(platform)) {
        this.shortcutLabel.set('Ctrl K');
      }
      this.measureDrawerMode();
    });
    // Pages ask for search through SearchOpener, e.g. the 404 page.
    const opener = inject(SearchOpener);
    effect(() => {
      if (opener.requests()) {
        untracked(() => this.search().open());
      }
    });
    // Keep the page behind the open drawer from scrolling.
    effect(() => {
      const lock = this.menuOpen() && this.drawerMode();
      this.document.documentElement.classList.toggle('drawer-open', lock);
    });
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
        // Arriving in a folded section opens it again.
        const section = e.urlAfterRedirects.split(/[/?#]/)[2];
        if (section && this.collapsed().has(section)) {
          this.toggleSection(section);
        }
        this.currentUrl.set(e.urlAfterRedirects);
      });

    // Slide the marker to the active link after each navigation, and follow
    // the sidebar's size while sections fold or the web font loads.
    afterRenderEffect((onCleanup) => {
      this.currentUrl();
      this.collapsed();
      const nav = this.sidebarNav()?.nativeElement;
      if (!nav) {
        this.sidebarMarker.set(null);
        return;
      }
      this.measureSidebarMarker(true);
      const observer = new ResizeObserver(() =>
        this.measureSidebarMarker(false),
      );
      observer.observe(nav);
      onCleanup(() => observer.disconnect());
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

  /** Used to re-measure the sidebar marker after each navigation. */
  private readonly currentUrl = signal('');

  isCollapsed(slug: string) {
    return this.collapsed().has(slug);
  }

  toggleSection(slug: string) {
    this.collapsed.update((set) => {
      const next = new Set(set);
      if (!next.delete(slug)) {
        next.add(slug);
      }
      return next;
    });
  }

  private measureSidebarMarker(slide: boolean) {
    const nav = this.sidebarNav()?.nativeElement;
    const active = nav?.querySelector<HTMLElement>('.sidebar-link.active');
    const group = active?.closest('.sidebar-group');
    if (
      !nav ||
      !active ||
      group?.classList.contains('sidebar-group-collapsed')
    ) {
      this.sidebarMarker.set(null);
      return;
    }
    const top =
      active.getBoundingClientRect().top - nav.getBoundingClientRect().top;
    this.sidebarMarker.set({ top, height: active.offsetHeight, slide });
  }

  toggleMenu() {
    this.menuOpen.update((open) => !open);
  }

  /** Cmd+K / Ctrl+K or "/" opens search; Escape closes the docs drawer. */
  onKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null;
    const typing =
      !!target &&
      (target.isContentEditable ||
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
    if (
      (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) ||
      (event.key === '/' && !typing)
    ) {
      event.preventDefault();
      this.search().open();
    } else if (event.key === 'Escape' && this.menuOpen()) {
      this.menuOpen.set(false);
    }
  }

  measureDrawerMode() {
    if (this.isBrowser) {
      this.drawerMode.set(innerWidth < 900);
    }
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
