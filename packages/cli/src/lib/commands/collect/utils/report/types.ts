import { Config, FlowResult } from 'lighthouse';
import { CLI_MODES } from '../../../../global/cli-mode/index.js';
import { PickOne } from '../../../../core/types.js';

type UfrSlice = PickOne<FlowResult>;
type LhrSlice = PickOne<FlowResult.Step['lhr']>;

export type GatherMode = FlowResult.Step['lhr']['gatherMode'];
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
    baseline?: ReducedFlowStepResult;
  };

export type ReducedReport = {
  cliMode?: CLI_MODES;
  dryRun?: boolean;
  headless?: boolean;
  name: string;
  fetchTime: string;
  steps: ReducedFlowStep[];
  config?: Config & { baseline?: any };
}

export type ReducedFlowStepResult = Record<string, number | FractionResults>;
