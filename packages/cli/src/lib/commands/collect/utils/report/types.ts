import Budget from 'lighthouse/types/lhr/budget';
import Config from 'lighthouse/types/config';
import { CLI_MODES } from '../../../../global/cli-mode';
import { PickOne } from '../../../../core/types';
import FlowResult from 'lighthouse/types/lhr/flow';

type OverBudget = { overBudget: number };
type BudgetAssertion = (Budget.ResourceBudget & OverBudget | Budget.TimingBudget & OverBudget)[];

type UfrSlice = PickOne<FlowResult>;
type LhrSlice = PickOne<FlowResult.Step['lhr']>;
/**
 * Plucks key value from oroginal LH report
 * @example
 *
 * const t: GatherModeSlice = {gatherMode: 'navigation'};
 * const f1: GatherModeSlice = {gatherMode: 'timespan'};
 * const f2: GatherModeSlice = {gatherMode: 'snapshot'};
 */
type LhrGatherModeSlice = LhrSlice & { gatherMode: FlowResult.Step['lhr']['gatherMode'] };
type UfrNameSlice = UfrSlice & { name: string };


/**
 * This type is the result of `calculateCategoryFraction` https://github.com/GoogleChrome/lighthouse/blob/master/core/util.cjs#L540.
 * As there is no typing present ATM we maintain our own.
 */
export type FractionResults = {
  numPassed: number;
  numPassableAudits: number;
  numInformative: number;
  totalWeight: number;
}

export type ReducedFlowStep =
  // gatherMode
  LhrGatherModeSlice &
  {
    name: string;
    fetchTime: string;
    results: ReducedFlowStepResult;
    resultsPerformanceBudget: any,
    baseline?: ReducedFlowStepResult;
  };

export type ReducedReport = {
  cliMode?: CLI_MODES;
  dryRun?: boolean;
  headless?: boolean;
  name: string;
  fetchTime: string;
  steps: ReducedFlowStep[];
  assertions?: {
    lhBudgetAssertion: BudgetAssertion,
    baselineAssertion: BudgetAssertion,
  }
  config?: Config.Json & { baseline?: any };
}

export type ReducedFlowStepResult = Record<string, number | FractionResults>;
