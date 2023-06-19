import {
  PuppeteerRunnerExtension,
  Step,
  UserFlow as UserFlowRecording,
} from '@puppeteer/replay';
import { Browser, Page } from 'puppeteer';
import { MeasurementStep, UserFlowRecordingStep } from './types';
import { isMeasureType } from './utils';
// @ts-ignore
import { UserFlow } from 'lighthouse/lighthouse-core/fraggle-rock/user-flow';

export class UserFlowRunnerExtension extends PuppeteerRunnerExtension {
  constructor(
    browser: Browser,
    page: Page,
    private flow: UserFlow,
    opts?: {
      timeout?: number;
    }
  ) {
    super(browser, page, opts);
  }

  // eslint-disable-next-line
  // @ts-ignore
  async runStep(
    step: UserFlowRecordingStep,
    flowRecording: UserFlowRecording
  ): Promise<void> {
    if (isMeasureType(step.type) && !this.flow?.currentTimespan) {
      const userFlowStep = step as MeasurementStep;
      const stepOptions = userFlowStep?.stepOptions;
      if (userFlowStep.type === 'navigate') {
        return this.flow[userFlowStep.type](userFlowStep?.url, {
          ...stepOptions,
        });
      }
      return this.flow[userFlowStep.type]({ ...stepOptions });
    } else {
      return super.runStep(step as Step, flowRecording);
    }
  }
}
