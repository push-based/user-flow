import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { ResolvedDoc } from './doc.resolver';

@Component({
  selector: 'docs-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './doc-page.html',
  styleUrl: './doc-page.scss',
})
export class DocPage {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);

  readonly doc = input.required<ResolvedDoc>();

  /** The rendered Markdown is authored in this repository, so it is trusted. */
  readonly html = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.doc().html),
  );

  readonly hasToc = computed(() => this.doc().toc.length > 1);

  /** Id of the heading currently in view, for the table of contents. */
  readonly activeId = signal<string | null>(null);

  private readonly prose = viewChild<ElementRef<HTMLElement>>('prose');

  /** Routes clicks on in-app links inside the rendered Markdown through the router. */
  onContentClick(event: MouseEvent) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey
    ) {
      return;
    }
    const anchor = (event.target as Element).closest<HTMLAnchorElement>(
      'a[data-internal]',
    );
    const target = anchor?.dataset['internal'];
    if (target) {
      event.preventDefault();
      this.router.navigateByUrl(target);
    }
  }

  constructor() {
    effect(() => {
      const { page } = this.doc();
      this.title.setTitle(`${page.title} · user-flow`);
      this.meta.updateTag({ name: 'description', content: page.description });
    });
    // Highlight the section in view. Runs in the browser only, after the content rendered.
    afterRenderEffect((onCleanup) => {
      const toc = this.doc().toc;
      const host = this.prose()?.nativeElement;
      if (
        !host ||
        typeof IntersectionObserver === 'undefined' ||
        toc.length < 2
      ) {
        this.activeId.set(null);
        return;
      }
      const headings = toc
        .map((entry) =>
          host.querySelector<HTMLElement>(`#${CSS.escape(entry.id)}`),
        )
        .filter((el): el is HTMLElement => !!el);
      const visible = new Set<string>();
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              visible.add(entry.target.id);
            } else {
              visible.delete(entry.target.id);
            }
          }
          const first = headings.find((h) => visible.has(h.id));
          if (first) {
            this.activeId.set(first.id);
          }
        },
        { rootMargin: '-72px 0px -60% 0px', threshold: 0 },
      );
      headings.forEach((h) => observer.observe(h));
      this.activeId.set(headings[0]?.id ?? null);
      onCleanup(() => observer.disconnect());
    });
  }
}
