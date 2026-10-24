import {
  Component,
  computed,
  effect,
  inject,
  input,
  ChangeDetectionStrategy,
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
  }
}
