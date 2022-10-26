import { UserFlow, Step } from '@puppeteer/replay';
import { Modify } from '../../../../core/utils/types';

/**
 *  'navigation' is already covered by `@puppeteer/replay`
 */
export type MeasureModes = 'navigate' |'snapshot' | 'startTimespan' | 'endTimespan';

/*
// Consider modify the Step type
  | Modify<Step, {
  type: MeasureModes,
}>;*/
export type MeasurementStep = {
  type: MeasureModes;
  stepOptions?: { stepName?: string; }
  url?: string;
}

export type UserFlowRunnerStep = MeasurementStep | Step;

export type UserFlowReportJson = Modify<UserFlow, {
  steps: UserFlowRunnerStep[];
}>;

export type ReadFileConfig = { fail?: boolean, ext?: 'json' };
