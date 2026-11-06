import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reveal } from '../shared/reveal';

type Rating = 'pass' | 'average' | 'fail';

interface Gauge {
  category: string;
  /** A 0–100 score for navigations; passed and total audits for timespans and snapshots. */
  score?: number;
  passed?: number;
  total?: number;
}

interface Step {
  mode: 'navigation' | 'timespan' | 'snapshot';
  name: string;
  kind: string;
  gauges: Gauge[];
}

/** Circumference of the gauge ring (r = 20). */
const RING = 125.66;

/**
 * A sample user flow report: one card per step, with Lighthouse-style gauges
 * that fill and count up when the report scrolls into view.
 */
@Component({
  selector: 'docs-report-preview',
  imports: [RouterLink, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './report-preview.html',
  styleUrl: './report-preview.scss',
})
export class ReportPreview {
  readonly ring = RING;

  readonly steps: Step[] = [
    {
      mode: 'navigation',
      name: 'Navigate to coffee cart',
      kind: 'Navigation report',
      gauges: [
        { category: 'Performance', score: 92 },
        { category: 'Accessibility', score: 100 },
        { category: 'Best practices', score: 96 },
        { category: 'SEO', score: 83 },
      ],
    },
    {
      mode: 'timespan',
      name: 'Select coffee',
      kind: 'Timespan report',
      gauges: [
        { category: 'Performance', passed: 9, total: 10 },
        { category: 'Best practices', passed: 6, total: 6 },
      ],
    },
    {
      mode: 'snapshot',
      name: 'Checkout form',
      kind: 'Snapshot report',
      gauges: [
        { category: 'Performance', passed: 3, total: 4 },
        { category: 'Accessibility', passed: 18, total: 19 },
        { category: 'Best practices', passed: 5, total: 5 },
        { category: 'SEO', passed: 9, total: 9 },
      ],
    },
  ];

  ratio(gauge: Gauge): number {
    return gauge.score !== undefined
      ? gauge.score / 100
      : (gauge.passed ?? 0) / (gauge.total ?? 1);
  }

  /** Lighthouse thresholds: 90+ passes, 50+ is average; fractions pass only when every audit does. */
  rating(gauge: Gauge): Rating {
    const r = this.ratio(gauge);
    if (gauge.score !== undefined) {
      return r >= 0.9 ? 'pass' : r >= 0.5 ? 'average' : 'fail';
    }
    return r === 1 ? 'pass' : r >= 0.5 ? 'average' : 'fail';
  }

  value(gauge: Gauge): number {
    return gauge.score ?? gauge.passed ?? 0;
  }

  label(gauge: Gauge): string {
    return gauge.score !== undefined
      ? `${gauge.category}: ${gauge.score}`
      : `${gauge.category}: ${gauge.passed} of ${gauge.total} audits passed`;
  }
}
