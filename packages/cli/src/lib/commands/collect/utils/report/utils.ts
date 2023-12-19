// @ts-ignore
import FlowResult from 'lighthouse/types/lhr/flow';
import { ReducedReport } from './types.js';
import { parseSteps } from './lh-utils.js';
import { toFileName } from '../../../../core/file/index.js';
import { isoDateStringToIsoLikeString } from '../persist/utils.js';

export function createReducedReport(flowResult: FlowResult): ReducedReport {
  const steps = parseSteps(flowResult.steps);
  return {
    name: flowResult.name,
    fetchTime: steps[0].fetchTime,
    steps
  };
}

export function enrichReducedReportWithBaseline(reducedReport: ReducedReport, baselineReport: FlowResult): ReducedReport {
  const baselineReducedReport = createReducedReport(baselineReport);
  const baselineResults = Object.fromEntries(baselineReducedReport.steps.map((step) => [step.name, step.results]));
  const steps = reducedReport.steps.map((step) => ({ ...step, 'baseline': baselineResults[step.name] }));
  return {
    ...reducedReport,
    steps
  };
}

export function toReportName(url: string, flowName: string, report: ReducedReport): string {
  const fetchTime = isoDateStringToIsoLikeString(report.steps[0].fetchTime);
  return `${toFileName(url)}-${toFileName(flowName)}-${isoDateStringToIsoLikeString(fetchTime)}`;
}
