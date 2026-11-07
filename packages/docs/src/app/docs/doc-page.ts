import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
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

/** How far below the top of the viewport a heading counts as "current". */
const ACTIVE_OFFSET = 120;

@Component({
  selector: 'docs-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './doc-page.html',
  styleUrl: './doc-page.scss',
  host: {
    '(window:resize)': 'measureMarker()',
    '(document:keydown.escape)': 'closeLightbox()',
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

  /** Id of the heading currently in view, for the table of contents. */
  readonly activeId = signal<string | null>(null);

  /** Position of the sliding marker next to the active table-of-contents entry. */
  readonly marker = signal<{ top: number; height: number } | null>(null);

  /** The image shown enlarged in the lightbox, if any. */
  readonly zoomed = signal<{ src: string; alt: string } | null>(null);

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
    const code = button.closest('.code-block')?.querySelector('code');
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
        let current = headings[0];
        for (const heading of headings) {
          if (heading.getBoundingClientRect().top <= ACTIVE_OFFSET) {
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

    // Code blocks that scroll sideways get a fade on the edge that has more code.
    afterRenderEffect((onCleanup) => {
      this.html();
      const host = this.prose()?.nativeElement;
      if (!host) {
        return;
      }
      const cleanups: (() => void)[] = [];
      host.querySelectorAll<HTMLElement>('.code-block').forEach((block) => {
        const pre = block.querySelector('pre');
        if (!pre) {
          return;
        }
        const update = () => {
          const overflow = pre.scrollWidth - pre.clientWidth > 1;
          block.classList.toggle(
            'overflows-end',
            overflow && pre.scrollLeft < pre.scrollWidth - pre.clientWidth - 1,
          );
          block.classList.toggle(
            'overflows-start',
            overflow && pre.scrollLeft > 1,
          );
        };
        update();
        pre.addEventListener('scroll', update, { passive: true });
        cleanups.push(() => pre.removeEventListener('scroll', update));
      });
      const win = this.document.defaultView;
      const onResize = () =>
        host
          .querySelectorAll('.code-block pre')
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
