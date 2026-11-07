import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { DOCS_NAV, SECTION_ICONS } from '../docs/nav';
import { HeroScene } from './hero-scene';
import { Reveal } from '../shared/reveal';
import { Tilt } from '../shared/tilt';
import { Spotlight } from '../shared/spotlight';
import { HowItWorks } from './how-it-works';
import { ReportPreview } from './report-preview';
import { FlowWalkthrough } from './flow-walkthrough';
import { CLI_VERSION } from '../../content/version.generated';

/** Typing speed of the hero terminal, per character, and the pause between commands. */
const CHAR_MS = 34;
const GAP_MS = 420;
const FIRST_COMMAND_MS = 900;

const COMMANDS = [
  'npm i @push-based/user-flow --save-dev',
  'npx user-flow init',
  'npx user-flow collect',
];

@Component({
  selector: 'docs-home',
  imports: [
    RouterLink,
    HeroScene,
    Reveal,
    Tilt,
    Spotlight,
    HowItWorks,
    FlowWalkthrough,
    ReportPreview,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  readonly sections = DOCS_NAV;
  readonly sectionIcons = SECTION_ICONS;
  readonly version = CLI_VERSION;
  readonly install = COMMANDS[0];

  /** The headline, one word at a time so each can rise into place. */
  readonly titleWords = [
    { text: 'Lighthouse' },
    { text: 'user' },
    { text: 'flows,' },
    { text: 'done', accent: true },
    { text: 'right.', accent: true },
  ];

  /** The hero terminal: each command types itself out after the previous one. */
  readonly commands = (() => {
    const lines: { text: string; chars: number; start: number }[] = [];
    let start = FIRST_COMMAND_MS;
    for (const text of COMMANDS) {
      lines.push({ text, chars: text.length, start });
      start += text.length * CHAR_MS + GAP_MS;
    }
    return lines;
  })();

  /** When the last command has been typed and its output can begin. */
  readonly outputStart = (() => {
    const last = this.commands[this.commands.length - 1];
    return last.start + last.chars * CHAR_MS + 500;
  })();

  readonly copied = signal(false);

  readonly benefits = [
    {
      icon: 'gauge',
      title: 'Runtime performance, not just page load',
      body: 'Lighthouse user flows measure navigations, interactions and page states. user-flow organises them so every step shows up in one report.',
    },
    {
      icon: 'zap',
      title: 'Zero setup, TypeScript first',
      body: 'Run init, answer three prompts and write flows in .uf.mts files. They are compiled on the fly, so there is no build step to maintain.',
    },
    {
      icon: 'ci',
      title: 'Built for CI',
      body: 'Non-interactive mode, Markdown and stdout reports and a ready-made GitHub action put performance numbers on every pull request.',
    },
    {
      icon: 'fast',
      title: 'Fast feedback with dry runs',
      body: 'Skip the measurements while you write interactions. A dry run takes seconds instead of a minute; then switch it off for real numbers.',
    },
    {
      icon: 'record',
      title: 'Replay DevTools recordings',
      body: 'Export a flow from the Chrome DevTools Recorder and replay it as is, or enrich its steps with timespans and snapshots.',
    },
    {
      icon: 'layers',
      title: 'Scales with UFOs',
      body: 'User flow objects separate selectors, interactions and measurements so large suites stay readable and reusable.',
    },
  ];

  /** Line icons for the benefits, on a 24px grid. */
  readonly icons: Record<string, string[]> = {
    gauge: ['M3.5 18a9 9 0 1 1 17 0', 'm12 15 3.5-3.5', 'M12 15h.01'],
    zap: ['M13 2 3 14h9l-1 8 10-12h-9l1-8z'],
    ci: [
      'M6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
      'M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
      'M18 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
      'M6 9v6',
      'M15 9a9 9 0 0 1-9 9',
    ],
    fast: ['m13 19 9-7-9-7v14z', 'm2 19 9-7-9-7v14z'],
    record: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
    layers: ['m12 2 10 5-10 5L2 7l10-5z', 'm2 17 10 5 10-5', 'm2 12 10 5 10-5'],
  };

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

  async copyInstall() {
    try {
      await navigator.clipboard.writeText(this.install);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1800);
    } catch {
      // Clipboard access can be denied; the command stays selectable.
    }
  }
}
