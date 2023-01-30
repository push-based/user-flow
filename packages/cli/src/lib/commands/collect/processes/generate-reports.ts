import {Util} from '../../../hacky-things/lighthouse';
import FlowResult from 'lighthouse/types/lhr/flow';
import { default as LHR } from 'lighthouse/types/lhr/lhr';

import {ReducedReport, ReducedFlowStepResult} from '../utils/user-flow/types';
import { userFlowReportToMdTable } from "../../assert/utils/md-table";

export function createReducedReport(flowResult: FlowResult): ReducedReport {
  const steps = flowResult.steps.map((step) => {
    const stepReport = Util.prepareReportResult(step.lhr);
    const { gatherMode } = stepReport;
    const categoriesEntries: [string, LHR.Category][] = Object.entries(stepReport.categories) as unknown as [string, LHR.Category][];
    const results: ReducedFlowStepResult = categoriesEntries.reduce((res, [categoryName, category]) => {
      res[categoryName] = Util.shouldDisplayAsFraction(stepReport.gatherMode) ?
        Util.calculateCategoryFraction(category): (category).score;
      return res
    }, {} as ReducedFlowStepResult);
    return { name: step.name, gatherMode, results };
  });
  return {name: flowResult.name, steps};
}

export function enrichReducedReportWithBaseline(reducedReport: ReducedReport, baselineReport: FlowResult): ReducedReport {
  const baselineReducedReport = createReducedReport(baselineReport);
  const baselineResults = Object.fromEntries(baselineReducedReport.steps.map((step) => [step.name, step.results]));
  const steps = reducedReport.steps.map((step) => ({...step, 'baseline': baselineResults[step.name]}));
  return {name: reducedReport.name, steps};
}

export function generateMdReport(flowResult: FlowResult): string {
  const dateTime = new Date().toISOString().replace('T', ' ').split('.')[0].slice(0, -3);
  const mdTable = userFlowReportToMdTable(flowResult);
  return `# ${flowResult.name}\n\nDate/Time: ${dateTime}\n\n${mdTable}`;
}
