import { UserFlowRecordingStep, UserFlowReportJson } from './types.js';
import { CustomStep, parse as puppeteerReplayParse, StepType } from '@puppeteer/replay';
import { isMeasureType } from './utils.js';

export function parse(recordingJson: { steps: { type?: string }[] }): UserFlowReportJson {
  // custom events to exclude from the default parser
  const ufArr: UserFlowRecordingStep[] = [];

  // filter out user-flow specific actions
  const steps = recordingJson.steps.filter(
    (value, index) => {
      if (isMeasureType(value?.type as string)) {
        ufArr[index] = value as UserFlowRecordingStep;
        return false;
      }
      return true;
    }
  );

  // parse the clean steps
  const parsed: UserFlowReportJson = puppeteerReplayParse({ ...recordingJson, steps });
  // add in user-flow specific actions
  ufArr.forEach((value, index) => {
    if (value) parsed.steps.splice(index, 0, value);
  });

  // parse customEvents from our stringify function
  parsed.steps = parsed.steps.map((step) => {
    if (step.type === StepType.CustomStep && isMeasureType(step.name)) {
      const { name: type, parameters } = step as CustomStep;
      return { type, parameters } as UserFlowRecordingStep;
    }
    return step;
  });

  return parsed;
}
