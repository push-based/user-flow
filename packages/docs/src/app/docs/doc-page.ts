import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { ResolvedDoc } from './doc.resolver';

/** Where the reader's last chosen code tab (npm, yarn, pnpm, …) is remembered. */
const TAB_KEY = 'user-flow-docs-code-tab';

/** Slack below the spot headings scroll to, within which a heading counts as "current". */
const ACTIVE_SLACK = 32;

@Component({
  selector: 'docs-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './doc-page.html',
  styleUrl: './doc-page.scss',
  host: {
    '(window:resize)': 'measureMarker()',
    '(document:keydown.escape)': 'closeLightbox(); closeTocMenu()',
    '(document:click)': 'onDocumentClick($event)',
    '(keydown)': 'onTabKeydown($event)',
    '(window:scroll)': 'onScroll()',
  },
})
export class DocPage {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly document = inject(DOCUMENT);

  readonly doc = input.required<ResolvedDoc>();

  /** The rendered Markdown is authored in this repository, so it is trusted. */
  readonly html = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.doc().html),
  );

  readonly hasToc = computed(() => this.doc().toc.length > 1);

  /** The section's first page stands in for the section in the breadcrumbs. */
  readonly sectionPath = computed(() => {
    const { section } = this.doc().page;
    return ['/docs', section.slug, section.pages[0].slug];
  });

  /** "Nov 6, 2026", formatted in UTC so the server and browser agree. */
  readonly lastUpdated = computed(() => {
    const iso = this.doc().page.lastUpdated;
    return iso
      ? new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
          timeZone: 'UTC',
        }).format(new Date(iso))
      : null;
  });

  /** The table-of-contents entry for the heading in view. */
  readonly activeEntry = computed(() => {
    const toc = this.doc().toc;
    return toc.find((entry) => entry.id === this.activeId()) ?? toc[0];
  });

  /** The back-to-top button shows once the reader is a screen down. */
  readonly showBackToTop = signal(false);

  /** Number of top-level sections on the page. */
  readonly sectionCount = computed(
    () => this.doc().toc.filter((entry) => entry.level === 2).length,
  );

  /** Id of the heading currently in view, for the table of contents. */
  readonly activeId = signal<string | null>(null);

  /** Position of the sliding marker next to the active table-of-contents entry. */
  readonly marker = signal<{ top: number; height: number } | null>(null);

  /** The image shown enlarged in the lightbox, if any. */
  readonly zoomed = signal<{ src: string; alt: string } | null>(null);

  private readonly tocMenu =
    viewChild<ElementRef<HTMLDetailsElement>>('tocMenu');
  private readonly prose = viewChild<ElementRef<HTMLElement>>('prose');
  private readonly tocList = viewChild<ElementRef<HTMLElement>>('tocList');
  private readonly lightbox =
    viewChild<ElementRef<HTMLDialogElement>>('lightbox');

  /** Handles clicks inside the rendered Markdown: in-app links, heading anchors, copy buttons and images. */
  onContentClick(event: MouseEvent) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey
    ) {
      return;
    }
    const target = event.target as Element;

    const tab = target.closest<HTMLButtonElement>('.code-tab');
    if (tab) {
      this.selectTab(tab.dataset['tab'] ?? '', { remember: true, anchor: tab });
      return;
    }

    const copy = target.closest<HTMLButtonElement>('.code-copy');
    if (copy) {
      this.copyCode(copy);
      return;
    }

    const image = target.closest<HTMLImageElement>('img:not(.img-icon)');
    if (image) {
      this.openLightbox(image);
      return;
    }

    const anchor = target.closest<HTMLAnchorElement>('a');
    const hash = anchor?.getAttribute('href');
    if (hash?.startsWith('#')) {
      event.preventDefault();
      this.goToHeading(hash.slice(1));
      return;
    }
    const internal = anchor?.dataset['internal'];
    if (internal) {
      event.preventDefault();
      this.router.navigateByUrl(internal);
    }
  }

  /** Arrow keys, Home and End move between tabs, as in the WAI-ARIA tabs pattern. */
  onTabKeydown(event: KeyboardEvent) {
    const tab = (event.target as Element).closest?.<HTMLButtonElement>(
      '.code-tab',
    );
    if (!tab) {
      return;
    }
    const tabs = Array.from(
      tab.parentElement?.querySelectorAll<HTMLButtonElement>('.code-tab') ?? [],
    );
    const index = tabs.indexOf(tab);
    const next =
      event.key === 'ArrowRight'
        ? tabs[(index + 1) % tabs.length]
        : event.key === 'ArrowLeft'
          ? tabs[(index - 1 + tabs.length) % tabs.length]
          : event.key === 'Home'
            ? tabs[0]
            : event.key === 'End'
              ? tabs[tabs.length - 1]
              : null;
    if (next) {
      event.preventDefault();
      this.selectTab(next.dataset['tab'] ?? '', {
        remember: true,
        anchor: next,
      });
      next.focus();
    }
  }

  /**
   * Shows the tab named `name` in every tab group that has one, so picking
   * pnpm once switches all install commands. The clicked group keeps its
   * place on screen while groups above it change height.
   */
  private selectTab(
    name: string,
    { remember = false, anchor }: { remember?: boolean; anchor?: Element } = {},
  ) {
    const host = this.prose()?.nativeElement;
    if (!host || !name) {
      return;
    }
    const before = anchor?.getBoundingClientRect().top;
    host.querySelectorAll<HTMLElement>('.code-tabs').forEach((group) => {
      const tabs = group.querySelectorAll<HTMLButtonElement>('.code-tab');
      if (!Array.from(tabs).some((tab) => tab.dataset['tab'] === name)) {
        return;
      }
      tabs.forEach((tab) => {
        const selected = tab.dataset['tab'] === name;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });
      group
        .querySelectorAll<HTMLElement>('.code-tabpanel')
        .forEach((panel) => (panel.hidden = panel.dataset['tab'] !== name));
      this.placeTabIndicator(group);
    });
    if (anchor && before !== undefined) {
      const shift = anchor.getBoundingClientRect().top - before;
      if (shift) {
        this.document.defaultView?.scrollBy(0, shift);
      }
    }
    host
      .querySelectorAll('.code-scroll')
      .forEach((el) => el.dispatchEvent(new Event('scroll')));
    if (remember) {
      try {
        localStorage.setItem(TAB_KEY, name);
      } catch {
        // Storage can be unavailable (private mode); the choice just isn't kept.
      }
    }
  }

  /** Moves the underline below the selected tab. */
  private placeTabIndicator(group: HTMLElement) {
    const selected = group.querySelector<HTMLElement>(
      '.code-tab[aria-selected="true"]',
    );
    const indicator = group.querySelector<HTMLElement>('.code-tab-indicator');
    if (selected && indicator) {
      indicator.style.left = `${selected.offsetLeft}px`;
      indicator.style.width = `${selected.offsetWidth}px`;
    }
  }

  /** Scrolls to a table-of-contents entry without leaving the page. */
  onTocClick(event: MouseEvent, id: string) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey) {
      return;
    }
    event.preventDefault();
    this.goToHeading(id);
  }

  /**
   * Scrolls a heading into view, puts its id in the address bar and flashes
   * it. A plain `href="#id"` would resolve against `<base href>` and leave
   * the page, so in-page links come through here.
   */
  goToHeading(
    id: string,
    { scroll = true, instant = false, updateUrl = true } = {},
  ) {
    const heading = this.prose()?.nativeElement.querySelector<HTMLElement>(
      `#${CSS.escape(id)}`,
    );
    if (!heading) {
      return;
    }
    if (scroll) {
      heading.scrollIntoView({
        behavior: instant || this.reducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      });
    }
    if (scroll && updateUrl) {
      const path = this.router.url.split('#')[0];
      this.location.replaceState(`${path}#${id}`);
    }
    this.activeId.set(id);
    heading.classList.remove('heading-flash');
    // Restart the animation when the same heading is picked twice in a row.
    void heading.offsetWidth;
    heading.classList.add('heading-flash');
    heading.addEventListener(
      'animationend',
      () => heading.classList.remove('heading-flash'),
      { once: true },
    );
  }

  closeTocMenu() {
    const menu = this.tocMenu()?.nativeElement;
    if (menu?.open) {
      menu.open = false;
    }
  }

  /** A tap outside the open "On this page" menu closes it. */
  onDocumentClick(event: MouseEvent) {
    const menu = this.tocMenu()?.nativeElement;
    if (menu?.open && !menu.contains(event.target as Node)) {
      menu.open = false;
    }
  }

  onScroll() {
    const win = this.document.defaultView;
    if (win) {
      this.showBackToTop.set(win.scrollY > win.innerHeight);
    }
  }

  backToTop() {
    this.document.defaultView?.scrollTo({
      top: 0,
      behavior: this.reducedMotion() ? 'auto' : 'smooth',
    });
    // Keep keyboard users at the top too, instead of on the hidden button.
    this.document
      .querySelector<HTMLElement>('.doc-title')
      ?.focus({ preventScroll: true });
  }

  closeLightbox() {
    const dialog = this.lightbox()?.nativeElement;
    if (!dialog?.open) {
      return;
    }
    dialog.classList.add('lightbox-closing');
    const done = () => {
      dialog.classList.remove('lightbox-closing');
      dialog.close();
      this.zoomed.set(null);
    };
    if (this.reducedMotion()) {
      done();
    } else {
      setTimeout(done, 200);
    }
  }

  private openLightbox(image: HTMLImageElement) {
    const dialog = this.lightbox()?.nativeElement;
    if (!dialog) {
      return;
    }
    this.zoomed.set({ src: image.currentSrc || image.src, alt: image.alt });
    dialog.showModal();
  }

  private copyCode(button: HTMLButtonElement) {
    const block = button.closest('.code-block');
    const code =
      block?.querySelector('.code-tabpanel:not([hidden]) code') ??
      block?.querySelector('code');
    if (!code) {
      return;
    }
    const text = code.textContent ?? '';
    const markCopied = () => {
      button.classList.add('copied');
      button.setAttribute('aria-label', 'Copied');
      setTimeout(() => {
        button.classList.remove('copied');
        button.setAttribute('aria-label', 'Copy code');
      }, 1800);
    };
    navigator.clipboard?.writeText(text).then(markCopied, () => undefined);
  }

  private reducedMotion() {
    return (
      this.document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)')
        .matches ?? false
    );
  }

  constructor() {
    inject(DestroyRef).onDestroy(() =>
      this.document.head.querySelector('#breadcrumb-data')?.remove(),
    );

    effect(() => {
      const { page } = this.doc();
      this.title.setTitle(`${page.title} · user-flow`);
      this.meta.updateTag({ name: 'description', content: page.description });
      this.meta.updateTag({
        property: 'og:title',
        content: `${page.title} · user-flow`,
      });
      this.meta.updateTag({
        property: 'og:description',
        content: page.description,
      });
      this.setBreadcrumbData();
    });

    // Track the heading in view. Runs in the browser only, after the content rendered.
    // The current heading is the last one whose top has passed a line just below the
    // header; at the very bottom of the page the last heading wins. Measuring on scroll
    // (instead of watching a narrow band) also holds up after jumps and reloads.
    afterRenderEffect((onCleanup) => {
      const toc = this.doc().toc;
      const host = this.prose()?.nativeElement;
      const win = this.document.defaultView;
      if (!host || !win || toc.length < 2) {
        this.activeId.set(null);
        return;
      }
      const headings = toc
        .map((entry) =>
          host.querySelector<HTMLElement>(`#${CSS.escape(entry.id)}`),
        )
        .filter((el): el is HTMLElement => !!el);
      let frame = 0;
      const update = () => {
        frame = 0;
        const root = this.document.documentElement;
        const atBottom = win.innerHeight + win.scrollY >= root.scrollHeight - 4;
        // Headings scroll to the scroll padding plus their scroll margin,
        // which grows below desktop width where the "On this page" bar sticks.
        const offset =
          parseFloat(win.getComputedStyle(root).scrollPaddingTop || '0') +
          parseFloat(win.getComputedStyle(headings[0]).scrollMarginTop || '0') +
          ACTIVE_SLACK;
        let current = headings[0];
        for (const heading of headings) {
          if (heading.getBoundingClientRect().top <= offset) {
            current = heading;
          }
        }
        if (atBottom) {
          const last = headings[headings.length - 1];
          if (last.getBoundingClientRect().top < win.innerHeight) {
            current = last;
          }
        }
        this.activeId.set(current?.id ?? null);
      };
      const onScroll = () => {
        frame ||= win.requestAnimationFrame(update);
      };
      update();
      win.addEventListener('scroll', onScroll, { passive: true });
      onCleanup(() => {
        win.removeEventListener('scroll', onScroll);
        win.cancelAnimationFrame(frame);
      });
    });

    // Bring a deep-linked heading into view and flash it once the page has
    // rendered. The router resets the scroll position on the initial
    // navigation, so this waits a frame and scrolls itself.
    afterRenderEffect(() => {
      this.doc();
      const win = this.document.defaultView;
      const hash = win?.location.hash.slice(1);
      if (hash) {
        win?.requestAnimationFrame(() =>
          this.goToHeading(decodeURIComponent(hash), {
            instant: true,
            updateUrl: false,
          }),
        );
      }
    });

    // Bring back the reader's tab choice, and place each tab underline.
    afterRenderEffect(() => {
      this.html();
      const host = this.prose()?.nativeElement;
      if (!host) {
        return;
      }
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(TAB_KEY);
      } catch {
        stored = null;
      }
      if (stored) {
        this.selectTab(stored);
      }
      host
        .querySelectorAll<HTMLElement>('.code-tabs')
        .forEach((group) => this.placeTabIndicator(group));
      this.document.fonts?.ready.then(() =>
        host
          .querySelectorAll<HTMLElement>('.code-tabs')
          .forEach((group) => this.placeTabIndicator(group)),
      );
    });

    // Code blocks that scroll sideways get a fade on the edge that has more code.
    afterRenderEffect((onCleanup) => {
      this.html();
      const host = this.prose()?.nativeElement;
      if (!host) {
        return;
      }
      const cleanups: (() => void)[] = [];
      host.querySelectorAll<HTMLElement>('.code-scroll').forEach((scroller) => {
        const pre = scroller.querySelector('pre');
        if (!pre) {
          return;
        }
        const update = () => {
          const overflow = pre.scrollWidth - pre.clientWidth > 1;
          scroller.classList.toggle(
            'overflows-end',
            overflow && pre.scrollLeft < pre.scrollWidth - pre.clientWidth - 1,
          );
          scroller.classList.toggle(
            'overflows-start',
            overflow && pre.scrollLeft > 1,
          );
        };
        update();
        // Re-measured through a synthetic scroll event on the wrapper too, after a tab switch.
        pre.addEventListener('scroll', update, { passive: true });
        scroller.addEventListener('scroll', update);
        cleanups.push(() => {
          pre.removeEventListener('scroll', update);
          scroller.removeEventListener('scroll', update);
        });
      });
      const win = this.document.defaultView;
      const onResize = () =>
        host
          .querySelectorAll('.code-scroll pre')
          .forEach((pre) => pre.dispatchEvent(new Event('scroll')));
      win?.addEventListener('resize', onResize);
      onCleanup(() => {
        cleanups.forEach((fn) => fn());
        win?.removeEventListener('resize', onResize);
      });
    });

    // Slide the marker to the active entry whenever it changes, and measure
    // again once the web font is in, since that can rewrap the entries.
    afterRenderEffect(() => {
      this.activeId();
      this.measureMarker();
      this.document.fonts?.ready.then(() => this.measureMarker());
    });
  }

  /** Breadcrumb structured data for search engines, rendered into the head. */
  private setBreadcrumbData() {
    const { page } = this.doc();
    const head = this.document.head;
    const base = 'https://push-based.github.io/user-flow';
    const items = [
      { name: 'Docs', path: '/docs' },
      { name: page.section.title, path: this.sectionPath().join('/') },
      { name: page.title, path: page.path },
    ];
    let script = head.querySelector<HTMLScriptElement>('#breadcrumb-data');
    if (!script) {
      script = this.document.createElement('script');
      script.id = 'breadcrumb-data';
      script.type = 'application/ld+json';
      head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: base + item.path,
      })),
    });
  }

  protected measureMarker() {
    const id = this.activeId();
    const list = this.tocList()?.nativeElement;
    const active = id
      ? list?.querySelector<HTMLElement>(`a[href="#${CSS.escape(id)}"]`)
      : null;
    if (!list || !active) {
      this.marker.set(null);
      return;
    }
    const listRect = list.getBoundingClientRect();
    const rect = active.getBoundingClientRect();
    this.marker.set({ top: rect.top - listRect.top, height: rect.height });
  }
}
