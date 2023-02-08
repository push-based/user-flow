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
