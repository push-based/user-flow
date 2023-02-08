import FlowResult from 'lighthouse/types/lhr/flow';
import { ReducedReport } from '../report/types';
import { parseSteps } from './lh-utils';

export function createReducedReport(flowResult: FlowResult): ReducedReport {
  const steps = parseSteps(flowResult.steps);
  return {
    name: flowResult.name,
   // date:
    steps
  } as any as ReducedReport;
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
