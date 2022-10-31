import {Util} from '../../../hacky-things/lighthouse';
import FlowResult from 'lighthouse/types/lhr/flow';
import { default as LHR } from 'lighthouse/types/lhr/lhr';

import { ReducedReport,ReducedFlowStepResult } from '../utils/user-flow/types';

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
