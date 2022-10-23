import { Step } from '@puppeteer/replay';

/**
 *  'navigation' is already covered by `@puppeteer/replay`
 */
export type MeasureModes = 'snapshot' | 'startTimespan' | 'endTimespan';

// @TODO Improve typing
export type UserFlowRunnerStep = {
  type: MeasureModes;
  stepOptions?: { stepName?: string; }
  url?: string;
};
