import Budget from 'lighthouse/types/lhr/budget';
import LhConfig from 'lighthouse/types/config';
import { CLI_MODES } from '../../../../global/cli-mode';
import { PickOne } from '../../../../core/types';
import UFR from 'lighthouse/types/lhr/flow-result';
import Details from 'lighthouse/types/lhr/audit-details';

type OverBudget = { overBudget: number };
type BudgetAssertion = (Budget.ResourceBudget & OverBudget | Budget.TimingBudget & OverBudget);

type UfrSlice = PickOne<UFR>;
type LhrSlice = PickOne<UFR.Step['lhr']>;

export type GatherMode = UFR.Step['lhr']['gatherMode'];
/**
 * Plucks key value from oroginal LH report
 * @example
 *
 * const t: GatherModeSlice = {gatherMode: 'navigation'};
 * const f1: GatherModeSlice = {gatherMode: 'timespan'};
 * const f2: GatherModeSlice = {gatherMode: 'snapshot'};
 */
type LhrGatherModeSlice = LhrSlice & { gatherMode: GatherMode };
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
    resultsPerformanceBudget?: Details.Table,
    resultsTimingBudget?: Details.Table,
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
  config?: LhConfig & { baseline?: any };
}

export type ReducedFlowStepResult = Record<string, number | FractionResults>;
