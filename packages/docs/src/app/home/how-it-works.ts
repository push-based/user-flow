import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reveal } from '../shared/reveal';

/**
 * Four steps from install to report. When the strip scrolls into view a line
 * draws itself through the step markers, which pop in one after another;
 * afterwards a pulse keeps travelling along the line.
 */
@Component({
  selector: 'docs-how-it-works',
  imports: [RouterLink, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.scss',
})
export class HowItWorks {
  /** Line icons for the steps, on a 24px grid. */
  readonly icons: Record<string, string[]> = {
    terminal: ['m4 17 6-6-6-6', 'M12 19h8'],
    pen: ['M12 20h9', 'M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z'],
    play: ['m6 4 14 8-14 8V4z'],
    chart: ['M3 3v18h18', 'M8 17V9', 'M13 17V5', 'M18 17v-3'],
  };

  readonly steps = [
    {
      icon: 'terminal',
      title: 'Set up',
      code: 'npx user-flow init',
      body: 'Answer three prompts. You get a .user-flowrc.json and an example flow.',
      link: '/docs/cli/init',
    },
    {
      icon: 'pen',
      title: 'Write a flow',
      code: 'order-coffee.uf.mts',
      body: 'Script the journey with Puppeteer and mark navigations, timespans and snapshots.',
      link: '/docs/user-flows/basics',
    },
    {
      icon: 'play',
      title: 'Collect',
      code: 'npx user-flow collect',
      body: 'Run every flow against your URL, on your machine or in CI.',
      link: '/docs/cli/collect',
    },
    {
      icon: 'chart',
      title: 'Read the report',
      code: 'HTML · JSON · Markdown',
      body: 'See every step in one Lighthouse report, or as a comment on the pull request.',
      link: '/docs/cli/reports',
    },
  ];
}
