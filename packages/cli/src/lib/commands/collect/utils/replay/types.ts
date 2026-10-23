import { UserFlow, Step } from '@puppeteer/replay';
import { UserFlow as LhUserFLow } from 'lighthouse';
import { Modify } from '../../../../core/types.js';

export const MEASURE_MODES = [
  'startNavigation',
  'endNavigation',
  'snapshot',
  'startTimespan',
  'endTimespan',
] as const;

export type MeasureModes = (typeof MEASURE_MODES)[number];

export type MeasurementStep = {
  [K in MeasureModes]: { type: K } & {
    stepOptions: Parameters<LhUserFLow[K]>[0];
  };
}[MeasureModes];

export type UserFlowRecordingStep = MeasurementStep | Step;

export type UserFlowReportJson = Modify<
  UserFlow,
  {
    steps: UserFlowRecordingStep[];
  }
>;

export type ReadFileExtTypes = { json: {}; html: string; text: string };
export type ReadFileConfig = { fail?: boolean; ext?: keyof ReadFileExtTypes };
