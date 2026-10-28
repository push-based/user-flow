export interface DocPageEntry {
  /** URL segment inside its section, e.g. `quick-start`. */
  slug: string;
  title: string;
  description: string;
  load: () => Promise<string>;
}

export interface DocSection {
  slug: string;
  title: string;
  pages: DocPageEntry[];
}

const md = (loader: () => Promise<{ default: string }>) => () =>
  loader().then((m) => m.default);

export const DOCS_NAV: DocSection[] = [
  {
    slug: 'getting-started',
    title: 'Getting started',
    pages: [
      {
        slug: 'introduction',
        title: 'Introduction',
        description:
          'What @push-based/user-flow is, why it exists and what it gives you out of the box.',
        load: md(() => import('../../content/getting-started/introduction.md')),
      },
      {
        slug: 'installation',
        title: 'Installation',
        description:
          'Install the CLI in an existing project, run it without installing, or start from an empty folder.',
        load: md(() => import('../../content/getting-started/installation.md')),
      },
      {
        slug: 'quick-start',
        title: 'Quick start',
        description:
          'Initialise a config, generate a first user flow and open your first Lighthouse report in minutes.',
        load: md(() => import('../../content/getting-started/quick-start.md')),
      },
    ],
  },
  {
    slug: 'cli',
    title: 'CLI reference',
    pages: [
      {
        slug: 'overview',
        title: 'Overview and global options',
        description:
          'The command structure, the global options every command accepts and how the rc file fits in.',
        load: md(() => import('../../content/cli/overview.md')),
      },
      {
        slug: 'init',
        title: 'init command',
        description:
          'Create or update a .user-flowrc.json and scaffold an example flow or a GitHub workflow.',
        load: md(() => import('../../content/cli/init.md')),
      },
      {
        slug: 'collect',
        title: 'collect command',
        description:
          'Execute user flows against a URL, pick report formats and speed up development with dry runs.',
        load: md(() => import('../../content/cli/collect.md')),
      },
      {
        slug: 'reports',
        title: 'Report formats and viewer',
        description:
          'HTML, JSON, Markdown and stdout reports, and how to open them in the Lighthouse viewer.',
        load: md(() => import('../../content/cli/reports.md')),
      },
      {
        slug: 'lighthouse-configuration',
        title: 'Lighthouse configuration',
        description:
          'Pass a Lighthouse config globally through the rc file or the CLI, or locally per flow.',
        load: md(() => import('../../content/cli/lighthouse-configuration.md')),
      },
      {
        slug: 'prompts-and-debugging',
        title: 'Prompts and debugging',
        description:
          'Keyboard shortcuts for prompts, multi-value options, boolean negation and verbose logging.',
        load: md(() => import('../../content/cli/prompts-and-debugging.md')),
      },
    ],
  },
  {
    slug: 'user-flows',
    title: 'Writing user flows',
    pages: [
      {
        slug: 'basics',
        title: 'Basic user flows',
        description:
          'The three Lighthouse measurement modes and how to combine navigation, timespan and snapshot steps.',
        load: md(() => import('../../content/user-flows/basics.md')),
      },
      {
        slug: 'ufo-architecture',
        title: 'UFO architecture',
        description:
          'Keep larger test suites maintainable with fixtures, user flow objects and thin flow files.',
        load: md(() => import('../../content/user-flows/ufo-architecture.md')),
      },
      {
        slug: 'recorder-exports',
        title: 'DevTools Recorder exports',
        description:
          'Record a flow in Chrome DevTools, export it as JSON and replay it with measurement steps.',
        load: md(() => import('../../content/user-flows/recorder-exports.md')),
      },
    ],
  },
  {
    slug: 'integrations',
    title: 'Integrations',
    pages: [
      {
        slug: 'github-workflow',
        title: 'GitHub workflow',
        description:
          'Run user flows on every pull request and post the Markdown report as a sticky PR comment.',
        load: md(() => import('../../content/integrations/github-workflow.md')),
      },
      {
        slug: 'nx-plugin',
        title: 'Nx plugin',
        description:
          'Generators and an executor that make user flows a first-class target in an Nx workspace.',
        load: md(() => import('../../content/integrations/nx-plugin.md')),
      },
    ],
  },
  {
    slug: 'resources',
    title: 'Resources',
    pages: [
      {
        slug: 'examples-and-links',
        title: 'Examples and links',
        description:
          'Example repositories, the Lighthouse viewer and further reading on user flows.',
        load: md(() => import('../../content/resources/examples-and-links.md')),
      },
    ],
  },
];

export interface FlatDocPage extends DocPageEntry {
  section: DocSection;
  path: string;
}

export const ALL_DOC_PAGES: FlatDocPage[] = DOCS_NAV.flatMap((section) =>
  section.pages.map((page) => ({
    ...page,
    section,
    path: `/docs/${section.slug}/${page.slug}`,
  })),
);

export function findDocPage(
  section: string,
  page: string,
): FlatDocPage | undefined {
  return ALL_DOC_PAGES.find(
    (p) => p.section.slug === section && p.slug === page,
  );
}
