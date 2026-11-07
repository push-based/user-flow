import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import { Reveal } from '../shared/reveal';
import { Mode, ModeIcon } from '../shared/mode-icon';

hljs.registerLanguage('typescript', typescript);

/** How long each step of the walkthrough stays on screen. */
export const STEP_MS = 3600;

const SOURCE = `import { UserFlowProvider } from '@push-based/user-flow';

export default {
  flowOptions: { name: 'Order coffee' },
  interactions: async ({ page, flow, collectOptions }) => {
    await flow.navigate(collectOptions.url, { name: 'Navigate to coffee cart' });

    await flow.startTimespan({ name: 'Select coffee' });
    await page.click('[data-test="Espresso"]');
    await page.waitForSelector('[data-test="checkout"]');
    await flow.endTimespan();

    await flow.snapshot({ name: 'Checkout form' });
  },
} satisfies UserFlowProvider;`;

interface Step {
  mode: Mode | 'collect' | 'report';
  name: string;
  kind: string;
  /** First and last source line (0-based) the step runs, inclusive. */
  lines: [number, number];
  score: string;
}

/**
 * The flow file next to the page it drives. The collect command starts the
 * run, each step lights up its lines of code while the browser mock acts
 * them out, then the report comes together. It plays by itself while on
 * screen, pauses under a mouse and lets the reader pick a step.
 */
@Component({
  selector: 'docs-flow-walkthrough',
  imports: [RouterLink, Reveal, ModeIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './flow-walkthrough.html',
  styleUrl: './flow-walkthrough.scss',
  host: {
    '(pointerenter)': 'onPointer($event, true)',
    '(pointerleave)': 'onPointer($event, false)',
  },
})
export class FlowWalkthrough {
  readonly steps: Step[] = [
    {
      mode: 'collect',
      name: 'npx user-flow collect',
      kind: 'Run',
      lines: [0, 14],
      score: '',
    },
    {
      mode: 'navigation',
      name: 'Navigate to coffee cart',
      kind: 'Navigation',
      lines: [5, 5],
      score: '92',
    },
    {
      mode: 'timespan',
      name: 'Select coffee',
      kind: 'Timespan',
      lines: [7, 10],
      score: '9/10',
    },
    {
      mode: 'snapshot',
      name: 'Checkout form',
      kind: 'Snapshot',
      lines: [12, 12],
      score: '18/19',
    },
    {
      mode: 'report',
      name: 'measures/order-coffee.uf.html',
      kind: 'Report',
      lines: [0, 14],
      score: '',
    },
  ];

  /** The measured steps, in order, for the report screen. */
  readonly measured = this.steps.filter((step) => step.score);

  /** The source, highlighted one line at a time so each line can be lit on its own. */
  readonly lines = SOURCE.split('\n').map(
    (line) => hljs.highlight(line, { language: 'typescript' }).value || ' ',
  );

  readonly active = signal(0);
  /** True while a mouse hovers the walkthrough. Touch never pauses it. */
  readonly paused = signal(false);
  /** Bumped on every step change so the progress bar restarts. */
  readonly tick = signal(0);
  /** Time the current step has been on screen, so a picked step gets its full turn. */
  private elapsed = 0;

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => this.autoplay());
  }

  select(index: number) {
    this.active.set(index);
    this.tick.update((n) => n + 1);
    this.elapsed = 0;
  }

  onPointer(event: PointerEvent, inside: boolean) {
    if (event.pointerType === 'mouse') {
      this.paused.set(inside);
    }
  }

  isLit(line: number) {
    const [from, to] = this.steps[this.active()].lines;
    return line >= from && line <= to;
  }

  private autoplay() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    let visible = false;
    let last = performance.now();
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        last = performance.now();
      },
      { threshold: 0.35 },
    );
    observer.observe(this.host.nativeElement);
    const timer = setInterval(() => {
      const now = performance.now();
      if (visible && !this.paused() && !document.hidden) {
        this.elapsed += now - last;
      }
      last = now;
      if (this.elapsed >= STEP_MS) {
        this.select((this.active() + 1) % this.steps.length);
      }
    }, 100);
    this.destroyRef.onDestroy(() => {
      observer.disconnect();
      clearInterval(timer);
    });
  }
}
