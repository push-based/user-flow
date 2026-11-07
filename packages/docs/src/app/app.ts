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
import { DOCS_NAV, SECTION_ICONS } from './docs/nav';

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
    '(window:scroll)': 'onScroll()',
  },
})
export class App {
  readonly nav = DOCS_NAV;
  readonly sectionIcons = SECTION_ICONS;

  readonly footerCommunity = [
    {
      label: 'GitHub repository',
      href: 'https://github.com/push-based/user-flow',
    },
    {
      label: 'Report an issue',
      href: 'https://github.com/push-based/user-flow/issues/new',
    },
    {
      label: 'Releases',
      href: 'https://github.com/push-based/user-flow/releases',
    },
    {
      label: 'Changelog',
      href: 'https://github.com/push-based/user-flow/blob/main/packages/cli/CHANGELOG.md',
    },
  ];

  readonly footerResources = [
    {
      label: 'npm package',
      href: 'https://www.npmjs.com/package/@push-based/user-flow',
    },
    {
      label: 'GitHub action',
      href: 'https://github.com/push-based/user-flow-gh-action',
    },
    {
      label: 'Nx plugin',
      href: 'https://www.npmjs.com/package/@push-based/user-flow-nx-plugin',
    },
    {
      label: 'Lighthouse user flows',
      href: 'https://web.dev/lighthouse-user-flows/',
    },
  ];

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

  /** True once the page has scrolled, so the header can separate from the content. */
  readonly scrolled = signal(false);

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

  onScroll() {
    this.scrolled.set(scrollY > 8);
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
