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
  mode: Mode | 'collect';
  name: string;
  kind: string;
  /** First and last source line (0-based) the step runs, inclusive. */
  lines: [number, number];
  score: string;
}

/**
 * The flow file next to the page it drives. Each step lights up its lines
 * of code while the browser mock acts them out, then the report comes
 * together. It plays by itself while on screen, pauses under the pointer and
 * lets the reader pick a step.
 */
@Component({
  selector: 'docs-flow-walkthrough',
  imports: [RouterLink, Reveal, ModeIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './flow-walkthrough.html',
  styleUrl: './flow-walkthrough.scss',
  host: {
    '(pointerenter)': 'paused.set(true)',
    '(pointerleave)': 'paused.set(false)',
    '(focusin)': 'paused.set(true)',
    '(focusout)': 'paused.set(false)',
  },
})
export class FlowWalkthrough {
  readonly steps: Step[] = [
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
      mode: 'collect',
      name: 'npx user-flow collect',
      kind: 'Report',
      lines: [0, 14],
      score: '',
    },
  ];

  /** The source, highlighted one line at a time so each line can be lit on its own. */
  readonly lines = SOURCE.split('\n').map(
    (line) => hljs.highlight(line, { language: 'typescript' }).value || ' ',
  );

  readonly active = signal(0);
  readonly paused = signal(false);
  /** Bumped on every step change so the progress bar restarts. */
  readonly tick = signal(0);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => this.autoplay());
  }

  select(index: number) {
    this.active.set(index);
    this.tick.update((n) => n + 1);
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
    let elapsed = 0;
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
        elapsed += now - last;
      }
      last = now;
      if (elapsed >= STEP_MS) {
        elapsed = 0;
        this.select((this.active() + 1) % this.steps.length);
      }
    }, 100);
    this.destroyRef.onDestroy(() => {
      observer.disconnect();
      clearInterval(timer);
    });
  }
}
