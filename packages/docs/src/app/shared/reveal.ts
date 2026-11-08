import {
  afterNextRender,
  Directive,
  ElementRef,
  inject,
  input,
} from '@angular/core';

/**
 * Fades and lifts an element into view the first time it scrolls into the
 * viewport.
 *
 * The server renders the element fully visible. In the browser the directive
 * only hides elements that are still below the fold when it runs, so content
 * that is already on screen never flickers. The matching styles live in
 * `styles.scss` under `.reveal`.
 */
@Directive({
  selector: '[docsReveal]',
  host: { class: 'reveal' },
})
export class Reveal {
  /** Delay before the element appears, in milliseconds. Use it to stagger a group. */
  readonly revealDelay = input(0, { alias: 'docsRevealDelay' });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender(() =>
      revealOnScroll(this.host.nativeElement, this.revealDelay()),
    );
  }
}

/**
 * Fades and lifts `el` in the first time it scrolls into view, after
 * `delay` milliseconds. Browser only; call it after the element rendered.
 * Use it directly for elements a directive can't reach, such as rendered
 * Markdown. Returns a function that stops observing.
 */
export function revealOnScroll(el: HTMLElement, delay = 0): () => void {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || typeof IntersectionObserver === 'undefined') {
    el.classList.add('reveal-in');
    return () => undefined;
  }
  const { top } = el.getBoundingClientRect();
  if (top < innerHeight * 0.9) {
    // Already on screen: show it without an entrance.
    el.classList.add('reveal-in', 'reveal-instant');
    return () => undefined;
  }
  el.style.setProperty('--reveal-delay', `${delay}ms`);
  el.classList.add('reveal-pending');
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        el.classList.add('reveal-in');
        observer.disconnect();
      }
    },
    // The huge top margin counts anything already scrolled past as seen,
    // so a jump to an anchor or a fast scroll never leaves content hidden.
    { rootMargin: '100000px 0px -10% 0px' },
  );
  observer.observe(el);
  return () => observer.disconnect();
}
