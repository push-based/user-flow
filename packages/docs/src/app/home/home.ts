import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { DOCS_NAV } from '../docs/nav';
import { HeroScene } from './hero-scene';
import { Reveal } from '../shared/reveal';
import { HowItWorks } from './how-it-works';
import { ReportPreview } from './report-preview';

@Component({
  selector: 'docs-home',
  imports: [RouterLink, HeroScene, Reveal, HowItWorks, ReportPreview],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  readonly sections = DOCS_NAV;

  readonly benefits = [
    {
      title: 'Runtime performance, not just page load',
      body: 'Lighthouse user flows measure navigations, interactions and page states. user-flow organises them so every step shows up in one report.',
    },
    {
      title: 'Zero setup, TypeScript first',
      body: 'Run init, answer three prompts and write flows in .uf.mts files. They are compiled on the fly, so there is no build step to maintain.',
    },
    {
      title: 'Built for CI',
      body: 'Non-interactive mode, Markdown and stdout reports and a ready-made GitHub action put performance numbers on every pull request.',
    },
    {
      title: 'Fast feedback with dry runs',
      body: 'Skip the measurements while you write interactions. A dry run takes seconds instead of a minute; then switch it off for real numbers.',
    },
    {
      title: 'Replay DevTools recordings',
      body: 'Export a flow from the Chrome DevTools Recorder and replay it as is, or enrich its steps with timespans and snapshots.',
    },
    {
      title: 'Scales with UFOs',
      body: 'User flow objects separate selectors, interactions and measurements so large suites stay readable and reusable.',
    },
  ];

  constructor() {
    const title = 'user-flow · Lighthouse user flows done right';
    const description =
      'A CLI and library to organise and run Lighthouse user flows with CI automation, TypeScript support and zero setup cost.';
    const meta = inject(Meta);
    inject(Title).setTitle(title);
    meta.updateTag({ name: 'description', content: description });
    meta.updateTag({ property: 'og:title', content: title });
    meta.updateTag({ property: 'og:description', content: description });
  }
}
