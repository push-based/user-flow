import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ALL_DOC_PAGES } from '../docs/nav';
import {
  SearchEntry,
  SearchIndex,
  SearchResult,
  searchEntries,
} from './search-index';

/** The search dialog. Opens from the header button, Cmd+K / Ctrl+K or "/". */
@Component({
  selector: 'docs-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  private readonly index = inject(SearchIndex);
  private readonly router = inject(Router);

  private readonly dialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly input =
    viewChild.required<ElementRef<HTMLInputElement>>('input');
  private readonly list = viewChild<ElementRef<HTMLElement>>('list');

  readonly query = signal('');
  readonly entries = signal<SearchEntry[] | null>(null);
  readonly selected = signal(0);
  readonly closing = signal(false);

  /** With an empty query the dialog lists every page, so it doubles as quick navigation. */
  readonly results = computed<SearchResult[]>(() => {
    const entries = this.entries();
    const query = this.query().trim();
    if (!query) {
      return ALL_DOC_PAGES.map((page) => ({
        entry: {
          path: page.path,
          section: page.section.title,
          page: page.title,
          heading: null,
          fragment: null,
          text: page.description,
        },
        snippet: [{ text: page.description, hit: false }],
      }));
    }
    return entries ? searchEntries(entries, query) : [];
  });

  open() {
    const dialog = this.dialog().nativeElement;
    if (dialog.open) {
      return;
    }
    this.closing.set(false);
    this.selected.set(0);
    dialog.showModal();
    this.input().nativeElement.select();
    if (!this.entries()) {
      this.index.load().then((entries) => this.entries.set(entries));
    }
  }

  close() {
    const dialog = this.dialog().nativeElement;
    if (!dialog.open || this.closing()) {
      return;
    }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      dialog.close();
      return;
    }
    this.closing.set(true);
    setTimeout(() => {
      dialog.close();
      this.closing.set(false);
    }, 160);
  }

  onInput(value: string) {
    this.query.set(value);
    this.selected.set(0);
  }

  onKeydown(event: KeyboardEvent) {
    // A search field swallows the first Escape to clear itself; close straight away instead.
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }
    const count = this.results().length;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!count) return;
      const step = event.key === 'ArrowDown' ? 1 : -1;
      this.selected.update((i) => (i + step + count) % count);
      this.scrollSelectedIntoView();
    } else if (event.key === 'Enter') {
      const result = this.results()[this.selected()];
      if (result) {
        event.preventDefault();
        this.go(result);
      }
    }
  }

  /** Clicks on the backdrop land on the dialog element itself. */
  onDialogClick(event: MouseEvent) {
    if (event.target === this.dialog().nativeElement) {
      this.close();
    }
  }

  go(result: SearchResult) {
    const { path, fragment } = result.entry;
    this.close();
    this.router.navigate([path], { fragment: fragment ?? undefined });
  }

  private scrollSelectedIntoView() {
    queueMicrotask(() =>
      this.list()
        ?.nativeElement.querySelector('[aria-selected="true"]')
        ?.scrollIntoView({ block: 'nearest' }),
    );
  }
}
