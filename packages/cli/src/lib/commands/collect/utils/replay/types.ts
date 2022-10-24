
export type MeasureModes = 'navigate' | 'snapshot' | 'startTimespan' | 'endTimespan';

// @TODO Improve typing
export type UserFlowRunnerStep = { 
  type: MeasureModes;
  stepOptions?: { stepName?: string; }
  url?: string;
};