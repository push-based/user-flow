/**
 * Diagrams drawn inline in the docs, placed with `<!-- diagram: name -->` in
 * Markdown. They are HTML and SVG that use the site's colour roles, so they
 * follow the theme, and they animate in through the reveal styles in
 * `_diagrams.scss`.
 */

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

export const DIAGRAMS: Record<string, () => string> = {
  'code-reduction': codeReduction,
  'ufo-architecture': ufoArchitecture,
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
