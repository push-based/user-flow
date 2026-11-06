import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reveal } from '../shared/reveal';

/**
 * Four steps from install to report. When the strip scrolls into view a line
 * draws itself through the step markers, which pop in one after another.
 */
@Component({
  selector: 'docs-how-it-works',
  imports: [RouterLink, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.scss',
})
export class HowItWorks {
  readonly steps = [
    {
      title: 'Set up',
      code: 'npx user-flow init',
      body: 'Answer three prompts. You get a .user-flowrc.json and an example flow.',
      link: '/docs/cli/init',
    },
    {
      title: 'Write a flow',
      code: 'order-coffee.uf.mts',
      body: 'Script the journey with Puppeteer and mark navigations, timespans and snapshots.',
      link: '/docs/user-flows/basics',
    },
    {
      title: 'Collect',
      code: 'npx user-flow collect',
      body: 'Run every flow against your URL, on your machine or in CI.',
      link: '/docs/cli/collect',
    },
    {
      title: 'Read the report',
      code: 'HTML · JSON · Markdown',
      body: 'See every step in one Lighthouse report, or as a comment on the pull request.',
      link: '/docs/cli/reports',
    },
  ];
}
