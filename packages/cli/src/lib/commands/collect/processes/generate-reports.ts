import FlowResult from 'lighthouse/types/lhr/flow';
import { userFlowReportToMdTable } from '../../assert/utils/md-table';
import { createReducedReport } from '../utils/report/utils';
import { ReducedReport } from '../utils/report/types';

export function enrichReducedReportWithBaseline(reducedReport: ReducedReport, baselineReport: FlowResult): ReducedReport {
  const baselineReducedReport = createReducedReport(baselineReport);
  const baselineResults = Object.fromEntries(baselineReducedReport.steps.map((step) => [step.name, step.results]));
  const steps = reducedReport.steps.map((step) => ({...step, 'baseline': baselineResults[step.name]}));
  return {
    ...reducedReport,
    steps
  };
}

export function generateMdReport(flowResult: FlowResult): string {
  const dateTime = new Date().toISOString().replace('T', ' ').split('.')[0].slice(0, -3);
  const mdTable = userFlowReportToMdTable(flowResult);
  return `# ${flowResult.name}\n\nDate/Time: ${dateTime}\n\n${mdTable}`;
}
