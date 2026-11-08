import {
  afterNextRender,
  Directive,
  ElementRef,
  inject,
  input,
} from '@angular/core';

/**
 * Tracks the pointer over the host and exposes its position as `--px` and
 * `--py`, each from -1 (left or top edge) to 1 (right or bottom edge), so
 * children can tilt or drift with it in CSS. The values ease back to 0 when
 * the pointer leaves. Touch devices and readers who prefer reduced motion
 * never see the variables change.
 */
@Directive({
  selector: '[docsTilt]',
  host: {
    '(pointermove)': 'onMove($event)',
    '(pointerleave)': 'reset()',
  },
})
export class Tilt {
  /** How far past the host's edges the pointer still counts, as a factor of its size. */
  readonly tiltReach = input(1, { alias: 'docsTiltReach' });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private enabled = false;
  private frame = 0;

  constructor() {
    afterNextRender(() => {
      this.enabled =
        matchMedia('(hover: hover) and (pointer: fine)').matches &&
        !matchMedia('(prefers-reduced-motion: reduce)').matches;
    });
  }

  onMove(event: PointerEvent) {
    if (!this.enabled) {
      return;
    }
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => {
      const rect = this.host.nativeElement.getBoundingClientRect();
      const reach = this.tiltReach();
      const px = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const py = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      this.set(clamp(px / reach), clamp(py / reach));
    });
  }

  reset() {
    cancelAnimationFrame(this.frame);
    if (this.enabled) {
      this.set(0, 0);
    }
  }

  private set(px: number, py: number) {
    const style = this.host.nativeElement.style;
    style.setProperty('--px', px.toFixed(3));
    style.setProperty('--py', py.toFixed(3));
  }
}

const clamp = (n: number) => Math.max(-1, Math.min(1, n));
