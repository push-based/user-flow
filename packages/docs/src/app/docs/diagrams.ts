/**
 * Diagrams drawn inline in the docs, placed with `<!-- diagram: name -->` in
 * Markdown. They are HTML and SVG that use the site's colour roles, so they
 * follow the theme, and they animate in through the reveal styles in
 * `_diagrams.scss`.
 */
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';

hljs.registerLanguage('json', json);

/** The sample flow every figure shows, with the scores the landing page uses. */
const SAMPLE_STEPS = [
  {
    mode: 'navigation',
    name: 'Navigate to coffee cart',
    kind: 'navigation',
    scores: { performance: '92', accessibility: '100', 'best-practices': '96', seo: '83' },
  },
  {
    mode: 'timespan',
    name: 'Select coffee',
    kind: 'timespan',
    scores: { performance: '9/10', accessibility: '-', 'best-practices': '6/6', seo: '-' },
  },
  {
    mode: 'snapshot',
    name: 'Checkout form',
    kind: 'snapshot',
    scores: { performance: '3/4', accessibility: '18/19', 'best-practices': '5/5', seo: '9/9' },
  },
] as const;

const CATEGORIES = [
  ['performance', 'Performance'],
  ['accessibility', 'Accessibility'],
  ['best-practices', 'Best practices'],
  ['seo', 'SEO'],
] as const;

/** Lighthouse colours: 90+ or every audit passed is green, 50+ is orange, the rest red. */
function rating(value: string): 'pass' | 'average' | 'fail' | 'none' {
  if (value === '-') {
    return 'none';
  }
  const [a, b] = value.split('/').map(Number);
  const ratio = b ? a / b : a / 100;
  if (b) {
    return ratio === 1 ? 'pass' : ratio >= 0.5 ? 'average' : 'fail';
  }
  return ratio >= 0.9 ? 'pass' : ratio >= 0.5 ? 'average' : 'fail';
}

function escape(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** One bar of a code row: its kind and its length in units. */
type Seg = [kind: 'm' | 'g' | 'r' | 'i' | 'h', length: number];

const CODE_ROWS: { label: string; lines: [Seg[][], Seg[][], Seg[][]] }[] = [
  {
    label: 'Import',
    lines: [[[['m', 2], ['g', 2]]], [[['m', 2], ['h', 2]]], [[['m', 2], ['h', 2]]]],
  },
  {
    label: 'Set up the flow',
    lines: [
      [
        [['g', 2], ['g', 1], ['g', 3], ['g', 3]],
        [['g', 2], ['g', 1], ['g', 1], ['g', 4]],
        [['g', 2], ['i', 3], ['g', 1]],
      ],
      [[['h', 2], ['i', 3], ['r', 2]]],
      [],
    ],
  },
  { label: 'Navigate', lines: [[[['m', 6]]], [[['m', 6]]], [[['m', 6]]]] },
  {
    label: 'Await ready',
    lines: [[[['g', 4]], [['r', 2], ['g', 3]]], [[['r', 4], ['g', 3]], [['r', 2], ['g', 3]]], []],
  },
  { label: 'Start timespan', lines: [[[['m', 6]]], [[['m', 6]]], [[['m', 6]]]] },
  {
    label: 'Interactions',
    lines: [
      [
        [['g', 2], ['i', 4], ['g', 1], ['r', 2]],
        [['g', 2], ['r', 2], ['g', 2], ['i', 4], ['g', 2], ['g', 1], ['r', 2]],
        [['g', 2], ['g', 1], ['i', 3], ['g', 1], ['r', 2], ['i', 4]],
      ],
      [
        [['g', 2], ['i', 4], ['r', 2]],
        [['g', 1], ['r', 2], ['g', 2], ['i', 4], ['g', 2], ['r', 2]],
        [['g', 2], ['g', 1], ['i', 3], ['g', 1], ['r', 2], ['i', 4]],
      ],
      [
        [['i', 4], ['h', 2]],
        [['i', 4], ['i', 3], ['h', 1]],
        [['i', 4], ['i', 4], ['h', 2]],
      ],
    ],
  },
  { label: 'End timespan', lines: [[[['m', 6]]], [[['m', 6]]], [[['m', 6]]]] },
  {
    label: 'Await ready',
    lines: [
      [[['r', 2], ['g', 3], ['i', 4]], [['g', 2], ['g', 2], ['r', 2]]],
      [[['r', 2], ['g', 3], ['i', 4]], [['g', 2], ['g', 2], ['r', 2]]],
      [[['i', 4], ['h', 2]]],
    ],
  },
  { label: 'Snapshot', lines: [[[['m', 6]]], [[['m', 6]]], [[['m', 6]]]] },
];

const CODE_COLUMNS = ['Lighthouse by hand', 'With the CLI', 'With UFOs'];

const LEGEND: [Seg[0], string][] = [
  ['m', 'Measurement'],
  ['g', 'Boilerplate'],
  ['r', 'Waiting'],
  ['i', 'Interaction'],
  ['h', 'user-flow helper'],
];

/** The same flow written three ways: the bars are lines of code, coloured by what they do. */
function codeReduction(): string {
  let bar = 0;
  const column = (index: number) => {
    const rows = CODE_ROWS.map((row) => {
      const lines = row.lines[index];
      const body = lines.length
        ? lines
            .map(
              (line) =>
                `<span class="dg-line">${line
                  .map(
                    ([kind, length]) =>
                      `<i class="dg-seg dg-${kind}" style="--w:${length};--n:${bar++}"></i>`,
                  )
                  .join('')}</span>`,
            )
            .join('')
        : '<span class="dg-line dg-line-empty"></span>';
      return `<div class="dg-row"><span class="dg-label">${row.label}</span><span class="dg-lines">${body}</span></div>`;
    });
    return `<div class="dg-col"><p class="dg-head">${CODE_COLUMNS[index]}</p>${rows.join('')}</div>`;
  };
  const columns = [0, 1, 2].map(column).join('<span class="dg-arrow" aria-hidden="true">→</span>');
  const legend = LEGEND.map(
    ([kind, label]) => `<li><i class="dg-seg dg-${kind}"></i>${label}</li>`,
  ).join('');
  return `<figure class="diagram diagram-code" role="img" aria-label="The same user flow written three ways. By hand, most lines are boilerplate and waiting. With the CLI the setup shrinks. With UFOs only measurements and interactions are left.">
<div class="dg-cols">${columns}</div>
<ul class="dg-legend" aria-hidden="true">${legend}</ul>
</figure>`;
}

const BOX_WIDTH = 180;

const box = (x: number, y: number, label: string, kind: string, mark = false) =>
  `<g class="dg-box dg-box-${kind}" transform="translate(${x} ${y})">
<rect width="${BOX_WIDTH}" height="44" rx="10"/>
${mark ? `<svg class="uf-mark dg-mark" x="12" y="10" width="24" height="24" viewBox="0 0 1360 1360"><use href="images/user-flow-mark.svg#mark"/></svg>` : ''}
<text x="${mark ? 44 : 16}" y="27">${label}</text>
</g>`;

/** A curve from the bottom of one box to the top of another, drawn in order `n`. */
const link = (x1: number, y1: number, x2: number, y2: number, n: number) => {
  const c = (y2 - y1) / 2;
  return `<path class="dg-link" style="--n:${n}" pathLength="1" d="M${x1} ${y1} C${x1} ${y1 + c} ${x2} ${y2 - c} ${x2} ${y2}"/>`;
};

const layer = (y: number, title: string, note: string) =>
  `<text class="dg-layer" x="0" y="${y + 20}">${title}</text><text class="dg-layer-note" x="0" y="${y + 36}">${note}</text>`;

const center = (x: number) => x + BOX_WIDTH / 2;

/** Fixtures feed UFOs, UFOs feed user flows, user flows produce reports. */
function ufoArchitecture(): string {
  const fixtures = [
    [120, 'list.fixture.mts'],
    [330, 'sidebar.fixture.mts'],
    [540, 'cart.fixture.mts'],
  ] as const;
  const ufos = [
    [60, 'sidebar.ufo.mts'],
    [260, 'list.ufo.mts'],
    [460, 'list-page.ufo.mts'],
    [670, 'cart.ufo.mts'],
  ] as const;
  const flows = [
    [220, 'browse-list.uf.mts'],
    [500, 'order-coffee.uf.mts'],
  ] as const;
  const reports = [
    [220, 'browse-list.uf.html'],
    [500, 'order-coffee.uf.html'],
  ] as const;
  const rowY = { fixtures: 30, ufos: 170, flows: 310, reports: 450 };
  // Which upper boxes each lower box uses.
  const fixtureToUfo: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 2],
    [2, 3],
    [2, 2],
  ];
  const ufoToFlow: [number, number][] = [
    [0, 0],
    [1, 0],
    [2, 0],
    [2, 1],
    [3, 1],
  ];
  let n = 0;
  const links = [
    ...fixtureToUfo.map(([f, u]) =>
      link(center(fixtures[f][0]), rowY.fixtures + 44, center(ufos[u][0]), rowY.ufos, n++),
    ),
    ...ufoToFlow.map(([u, f]) =>
      link(center(ufos[u][0]), rowY.ufos + 44, center(flows[f][0]), rowY.flows, n++),
    ),
    ...flows.map(([x], i) => link(center(x), rowY.flows + 44, center(reports[i][0]), rowY.reports, n++)),
  ].join('');
  return `<figure class="diagram diagram-ufo" role="img" aria-label="Fixtures hold selectors and feed user flow objects. User flow objects hold interactions and feed user flows. Each user flow produces a report.">
<svg viewBox="-110 0 1000 500" class="dg-svg">
${layer(rowY.fixtures, 'Fixtures', 'selectors')}
${layer(rowY.ufos, 'UFOs', 'interactions')}
${layer(rowY.flows, 'User flows', 'measurements')}
${layer(rowY.reports, 'Reports', 'per flow')}
${links}
${fixtures.map(([x, label]) => box(x, rowY.fixtures, label, 'fixture')).join('')}
${ufos.map(([x, label]) => box(x, rowY.ufos, label, 'ufo', true)).join('')}
${flows.map(([x, label]) => box(x, rowY.flows, label, 'flow')).join('')}
${reports.map(([x, label]) => box(x, rowY.reports, label, 'report')).join('')}
</svg>
</figure>`;
}

/** A Lighthouse-style gauge: a ring with the score, or a pill for audit counts. */
function gauge(value: string): string {
  const r = rating(value);
  if (r === 'none') {
    return '<span class="rf-gauge rf-gauge-none">–</span>';
  }
  const [a, b] = value.split('/').map(Number);
  const pct = b ? Math.round((a / b) * 100) : a;
  return `<span class="rf-gauge" data-rating="${r}" style="--pct:${pct}"><svg viewBox="0 0 36 36" aria-hidden="true"><circle class="rf-track" cx="18" cy="18" r="15"/><circle class="rf-arc" cx="18" cy="18" r="15" pathLength="100"/></svg><b>${value}</b></span>`;
}

/** The table every text format carries, as the Markdown report prints it. */
const reportRows = () =>
  SAMPLE_STEPS.map(
    (step) =>
      `<tr><td>${modeIcon(step.mode)}${escape(step.name)}</td><td><code>${step.kind}</code></td>${CATEGORIES.map(
        ([key]) => `<td class="rf-cell" data-rating="${rating(step.scores[key])}">${step.scores[key]}</td>`,
      ).join('')}</tr>`,
  ).join('');

const reportTable = () =>
  `<div class="table-wrap"><table><thead><tr><th>Step</th><th>Gather mode</th>${CATEGORIES.map(([, label]) => `<th>${label}</th>`).join('')}</tr></thead><tbody>${reportRows()}</tbody></table></div>`;

/** The four report formats of one run, switchable like the code tabs. */
function reportFormats(): string {
  const html = `<div class="rf-report"><div class="rf-head"><div><p class="rf-kicker">Lighthouse user flow report</p><p class="rf-title">Order Coffee</p></div><span class="rf-badge">order-coffee.uf.html</span></div><ol class="rf-steps">${SAMPLE_STEPS.map(
    (step) =>
      `<li class="rf-step"><span class="rf-step-head">${modeIcon(step.mode)}<span><b>${escape(step.name)}</b><small>${step.kind} report</small></span></span><span class="rf-gauges">${CATEGORIES.map(
        ([key, label]) => `<span class="rf-score">${gauge(step.scores[key])}<small>${label}</small></span>`,
      ).join('')}</span></li>`,
  ).join('')}</ol></div>`;
  const jsonSource = JSON.stringify(
    {
      name: 'Order Coffee',
      steps: SAMPLE_STEPS.slice(0, 2).map((step) => ({
        name: step.name,
        lhr: {
          gatherMode: step.kind,
          finalDisplayedUrl: 'https://coffee-cart.netlify.app/',
          categories: Object.fromEntries(
            CATEGORIES.filter(([key]) => step.scores[key] !== '-').map(([key]) => [
              key,
              { score: step.scores[key].includes('/') ? null : Number(step.scores[key]) / 100 },
            ]),
          ),
          audits: { '…': '…' },
        },
      })),
    },
    null,
    2,
  );
  const jsonPanel = `<div class="code-scroll"><pre><code class="hljs language-json">${hljs.highlight(jsonSource, { language: 'json' }).value}</code></pre></div>`;
  const md = `<div class="rf-md"><p class="rf-md-title">☕ Order Coffee ☕</p><p class="rf-md-date">Date/Time: <b>2026-11-07 14:02</b></p>${reportTable()}</div>`;
  const stdoutLines = [
    '☕ Order Coffee ☕',
    '',
    '| Step Name                | Gather Mode | Performance | Accessibility | Best Practices | Seo |',
    '|:-------------------------|:-----------:|:-----------:|:-------------:|:--------------:|:---:|',
    ...SAMPLE_STEPS.map(
      (step) =>
        `| ${step.name.padEnd(24)} | ${step.kind.padStart(7).padEnd(11)} | ${step.scores.performance.padStart(7).padEnd(11)} | ${step.scores.accessibility.padStart(8).padEnd(13)} | ${step.scores['best-practices'].padStart(8).padEnd(14)} | ${step.scores.seo.padStart(2).padEnd(3)} |`,
    ),
  ];
  const stdout = `<div class="code-scroll"><pre><code class="hljs"><span class="term-cmd">npx user-flow collect --format stdout</span>\n<span class="term-out">${escape(stdoutLines.join('\n'))}</span></code></pre></div>`;
  const tabs: [string, string][] = [
    ['HTML', html],
    ['JSON', jsonPanel],
    ['Markdown', md],
    ['stdout', stdout],
  ];
  const buttons = tabs
    .map(
      ([name], i) =>
        `<button class="code-tab" type="button" role="tab" id="tab-rf-${i}" aria-controls="tabpanel-rf-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-tab="${name}">${name}</button>`,
    )
    .join('');
  const panels = tabs
    .map(
      ([name, body], i) =>
        `<div class="code-tabpanel" role="tabpanel" id="tabpanel-rf-${i}" aria-labelledby="tab-rf-${i}" data-tab="${name}"${i === 0 ? '' : ' hidden'}>${body}</div>`,
    )
    .join('');
  return `<figure class="code-block code-tabs format-tabs"><div class="code-title"><div class="code-tablist" role="tablist" aria-label="Report format">${buttons}<span class="code-tab-indicator" aria-hidden="true"></span></div><span class="format-tabs-hint">one run, four formats</span></div>${panels}</figure>`;
}

/** Pull request → action → report → comment, in one line. */
function ciFlow(): string {
  const nodes = [
    ['Pull request', 'opened or updated', 'M6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6 9v6M15 9a9 9 0 0 1-9 9'],
    ['user-flow collect', 'CI mode, no prompts', 'm6 4 14 8-14 8V4z'],
    ['Markdown report', 'measures/*.uf.md', 'M3 3v18h18M8 17V9M13 17V5M18 17v-3'],
    ['Sticky comment', 'replaced on every run', 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'],
  ];
  const W = 190;
  const gap = 46;
  const boxes = nodes
    .map(
      ([title, note, icon], i) =>
        `<g class="dg-box dg-box-${['fixture', 'ufo', 'flow', 'report'][i]}" transform="translate(${i * (W + gap)} 20)"><rect width="${W}" height="64" rx="12"/><svg x="14" y="20" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dg-icon"><path d="${icon}"/></svg><text x="48" y="31" class="dg-strong">${title}</text><text x="48" y="50" class="dg-note">${note}</text></g>`,
    )
    .join('');
  const arrows = nodes
    .slice(1)
    .map((_, i) => {
      const x1 = i * (W + gap) + W;
      const x2 = x1 + gap;
      return `<path class="dg-link dg-arrow" style="--n:${i}" pathLength="1" d="M${x1 + 4} 52 H${x2 - 10}"/><path class="dg-link dg-arrowhead" style="--n:${i}" pathLength="1" d="M${x2 - 16} 46 l8 6 -8 6"/>`;
    })
    .join('');
  const loop = `<path class="dg-link dg-loop" style="--n:3" pathLength="1" d="M${3 * (W + gap) + W / 2} 86 V116 H${W / 2} V86"/><text class="dg-note" x="${(3 * (W + gap) + W) / 2}" y="134" text-anchor="middle">the next push runs it again</text>`;
  return `<figure class="diagram diagram-ci" role="img" aria-label="A pull request triggers the action, which runs user-flow collect in CI mode, writes a Markdown report and posts it as a sticky comment on the pull request. The next push runs it again.">
<svg viewBox="-4 0 ${4 * W + 3 * gap + 8} 150" class="dg-svg">${arrows}${loop}${boxes}</svg>
</figure>`;
}

/** The comment the action leaves on a pull request. */
function prComment(): string {
  return `<figure class="diagram diagram-pr" role="img" aria-label="A pull request comment by the GitHub Actions bot with the user flow report table.">
<div class="prc"><div class="prc-head"><span class="prc-avatar" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="12" rx="3"/><path d="M12 8V4M8 4h8M8 14h.01M16 14h.01M9 17h6"/></svg></span><b>github-actions</b><span class="prc-bot">bot</span><span class="prc-time">commented 2 minutes ago</span></div><div class="prc-body"><p class="rf-md-title">☕ Order Coffee ☕</p><p class="rf-md-date">Date/Time: <b>2026-11-07 14:02</b></p>${reportTable()}</div></div>
</figure>`;
}

/** A command box of the command map, with its name, purpose and a few notes. */
const commandBox = (x: number, kind: string, title: string, note: string, items: string[]) =>
  `<g class="dg-box dg-box-${kind}" transform="translate(${x} 120)"><rect width="310" height="${68 + items.length * 24}" rx="12"/><text x="20" y="30" class="dg-strong">${title}</text><text x="20" y="48" class="dg-note">${note}</text>${items
    .map((item, i) => `<text x="20" y="${78 + i * 24}" class="dg-item">${item}</text>`)
    .join('')}</g>`;

/** The CLI: one entry point, two commands, and what each one does. */
function commandMap(): string {
  return `<figure class="diagram diagram-cli" role="img" aria-label="npx user-flow runs one of two commands. init writes the rc file and an example flow, optionally a GitHub workflow. collect, the default, runs the flows against a URL and writes reports. Global options such as --rcPath, --verbose and --interactive apply to both.">
<svg viewBox="0 0 700 316" class="dg-svg">
<g class="dg-box dg-box-ufo" transform="translate(200 16)"><rect width="300" height="48" rx="12"/><text x="150" y="30" text-anchor="middle" class="dg-strong">npx user-flow [command] [options]</text></g>
<path class="dg-link" style="--n:0" pathLength="1" d="M350 64 V88 H185 V120"/>
<path class="dg-link" style="--n:1" pathLength="1" d="M350 64 V88 H515 V120"/>
${commandBox(30, 'fixture', 'init', 'set up a project', ['writes .user-flowrc.json', 'scaffolds an example flow', '--generateFlow', '--generateGhWorkflow'])}
${commandBox(360, 'flow', 'collect', 'the default command', ['runs every flow against --url', 'writes --format reports to --outPath', '--dryRun, --openReport', '--configPath, --serveCommand'])}
<text x="350" y="302" text-anchor="middle" class="dg-note">global: --rcPath · --verbose · --interactive · --help · --version</text>
</svg>
</figure>`;
}

/** The three kinds of step and which categories each one can score. */
function measurementModes(): string {
  const modes = [
    ['navigation', 'Navigation', 'A page load, cold or warm', 'The classic Lighthouse run.', [true, true, true, true]],
    ['timespan', 'Timespan', 'An interaction over time', 'The only mode that sees runtime work: long tasks, layout shifts, requests.', [true, false, true, false]],
    ['snapshot', 'Snapshot', 'The page as it is right now', 'Audits the current DOM without loading or interacting.', [true, true, true, true]],
  ] as const;
  return `<figure class="diagram diagram-modes" role="img" aria-label="Navigation measures a page load and scores every category. Timespan measures an interaction over time and scores performance and best practices. Snapshot audits the current page state and scores every category.">
<div class="modes">${modes
    .map(
      ([mode, title, what, note, cats]) =>
        `<div class="mode mode-${mode}"><span class="mode-icon">${modeIcon(mode)}</span><b>${title}</b><span class="mode-what">${what}</span><span class="mode-note">${note}</span><ul class="mode-cats">${CATEGORIES.map(
          ([, label], i) => `<li class="${cats[i] ? 'on' : 'off'}">${label}</li>`,
        ).join('')}</ul></div>`,
    )
    .join('')}</div>
</figure>`;
}

export const DIAGRAMS: Record<string, () => string> = {
  'code-reduction': codeReduction,
  'ufo-architecture': ufoArchitecture,
  'report-formats': reportFormats,
  'ci-flow': ciFlow,
  'pr-comment': prComment,
  'command-map': commandMap,
  'measurement-modes': measurementModes,
};

/** The Lighthouse icon for a measurement mode, inline, for use in tables and text. */
export function modeIcon(mode: string): string | null {
  const extra =
    mode === 'timespan'
      ? '<path d="M12 7v5l3.5 2"/>'
      : mode === 'snapshot'
        ? '<path d="m14.3 8 5.2 9M9.7 8h10.4M7.4 12l5.2-9M9.7 16 4.5 7M14.3 16H3.9M16.6 12l-5.2 9"/>'
        : mode === 'navigation'
          ? ''
          : null;
  if (extra === null) {
    return null;
  }
  return `<svg class="img-icon mode-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/>${extra}</svg>`;
}
