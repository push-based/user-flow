// @ts-ignore
import {Util} from 'lighthouse/lighthouse-core/util-commonjs';
import FlowResult from 'lighthouse/types/lhr/flow';
import { ReducedReport } from '../utils/user-flow/types';

export function createReducedReport(flowResult: FlowResult): ReducedReport {
  const cliReport: any = {name: flowResult.name};
  cliReport['steps'] =  flowResult.steps.map((step) => {
    const stepReport = Util.prepareReportResult(step.lhr);
    const stepDetails: any = {name: step.name, type: stepReport.gatherMode};
    stepDetails['results'] = Util.shouldDisplayAsFraction(stepReport.gatherMode) ?
      Object.assign({}, ...Object.values(stepReport.categories).map(
        (category: any) => ({[category.title]: Util.calculateCategoryFraction(category)})
      )) : Object.assign({}, ...Object.values(stepReport.categories).map(
        (category: any) => ({[category.title]: category.score})
      ));
    return stepDetails;
  });
  return cliReport;
}
