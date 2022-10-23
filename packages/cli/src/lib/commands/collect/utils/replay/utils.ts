import {
  CustomStep,
  parse as puppeteerReplayParse,
  Step,
  UserFlow,
  UserStep
} from '@puppeteer/replay';
import { MeasureModes, UserFlowStep } from './types';

export function isMeasureType(str: string) {
    switch (str as MeasureModes) {
        case 'navigate':
        case 'snapshot':
        case 'startTimespan':
        case 'endTimespan':
            return true;
        default:
            return false;
    }
}

export function parse(recordingJson: { title: string, steps: UserFlowStep[] }): UserFlow {
  const ufArr: Step[] = [];
  // filter out user-flow specific actions
  const steps = recordingJson.steps.filter(
    (value: any, index: number) => {
      if (isMeasureType(value?.type)) {
        ufArr[index] = value;
        return false;
      }
      return true;
    }
  );
  // parse the clean steps
  const parsed = puppeteerReplayParse({ ...recordingJson, steps });
  // add in user-flow specific actions
  ufArr.forEach((value, index) => {
    value && (parsed.steps.splice(index, 0, value));
  });

  // parse customEvents from our stringify function
  parsed.steps = parsed.steps.map((step: UserStep | UserFlowStep): UserFlowStep => {
    if (step.type === 'customStep' && isMeasureType(step.name)) {
      const { name: type, parameters } = step as any;
      return { type, parameters };
    }
    return step;
  }) as Step[];

  return parsed;
}

function userFlowStepToCustomStep(step: UserFlowStep): Step {
  const { type: name, parameters } = step as any;
  const stdStp: CustomStep = {
    type: 'customStep',
    name,
    parameters
  };
  return stdStp;
}

export function stringify(enrichedRecordingJson: { title: string, steps: UserFlowStep[] }): string {
  const { title, steps } = enrichedRecordingJson;
  const standardizedJson = {
    title,
    steps: (steps).map(
      (step) => {
        if (isMeasureType(step.type)) {
          return userFlowStepToCustomStep(step as unknown as UserFlowStep);
        }
        return step;
      }
    )
  };
  return JSON.stringify(standardizedJson);
}
