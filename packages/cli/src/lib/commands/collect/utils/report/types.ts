import Budget from 'lighthouse/types/lhr/budget';
import { ReducedFlowStep } from '../user-flow/types';
import Config from 'lighthouse/types/config';
import { CLI_MODES } from '../../../../../../../../dist/packages/cli/src/lib/global/cli-mode';

type OverBudget = {overBudget: number};
type BudgetAssertion = (Budget.ResourceBudget & OverBudget | Budget.TimingBudget & OverBudget)[];

export type ReducedReport = {
  cliMode?: CLI_MODES;
  dryRun?: boolean;
  headless?: boolean;
  name: string;
  date: string;
  steps: ReducedFlowStep[];
  assertions?: {
   lhBudgetAssertion: BudgetAssertion,
   baselineAssertion: BudgetAssertion,
  }
  config?: Config.Json;
}
