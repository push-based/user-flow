import { UserFlow, Step } from '@puppeteer/replay';
import { Modify } from '../../../../core/utils/types';

/**
 *  'navigation' is already covered by `@puppeteer/replay`
 */
export type MeasureModes = 'navigate' |'snapshot' | 'startTimespan' | 'endTimespan';

export type MeasurementStep = {
  type: MeasureModes;
  stepOptions?: { stepName?: string; }
  url?: string;
}

// @TODO Improve typing
export type UserFlowRunnerStep = MeasurementStep | Step;
/*
// Consider modify the Step type
  | Modify<Step, {
  type: MeasureModes,
}>;*/



export type UserFlowReportJson = Modify<UserFlow, {
  steps: UserFlowRunnerStep[];
}>;

export type ReadFileConfig = { fail?: boolean, ext?: 'json' };

