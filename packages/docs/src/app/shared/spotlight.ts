import { afterNextRender, Directive, ElementRef, inject } from '@angular/core';

/**
 * Lets a card glow where the pointer is: the host gets `--mx` and `--my`
 * (the pointer's offset inside it, in pixels) and the `spotlight` class,
 * which paints a soft radial highlight at that point on hover. The styles
 * live in `_building-blocks.scss`.
 */
@Directive({
  selector: '[docsSpotlight]',
  host: {
    class: 'spotlight',
    '(pointermove)': 'onMove($event)',
  },
})
export class Spotlight {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private enabled = false;

  constructor() {
    afterNextRender(() => {
      this.enabled = matchMedia('(hover: hover) and (pointer: fine)').matches;
    });
  }

  onMove(event: PointerEvent) {
    if (!this.enabled) {
      return;
    }
    const el = this.host.nativeElement;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    el.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }
}
