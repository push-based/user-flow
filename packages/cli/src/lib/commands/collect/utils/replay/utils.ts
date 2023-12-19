import { CustomStep, Step, StepType } from '@puppeteer/replay';
import { MeasureModes, UserFlowRecordingStep } from './types.js';

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

export function stringify(enrichedRecordingJson: { title: string, steps: UserFlowRecordingStep[] }): string {
  const { title, steps } = enrichedRecordingJson;
  const standardizedJson = {
    title,
    steps: (steps).map(
      (step) => {
        if (isMeasureType(step.type)) {
          return userFlowStepToCustomStep(step as unknown as UserFlowRecordingStep);
        }
        return step;
      }
    )
  };
  return JSON.stringify(standardizedJson);
}

function userFlowStepToCustomStep(step: UserFlowRecordingStep): Step {
  const { type: name, parameters } = step as any;
  return {
    type: StepType.CustomStep,
    name,
    parameters
  };
}
