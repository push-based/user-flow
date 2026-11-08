import {
  PuppeteerRunnerExtension,
  Step,
  UserFlow as UserFlowRecording,
} from '@puppeteer/replay';
import { Browser, Page } from 'puppeteer';
import { MeasurementStep, UserFlowRecordingStep } from './types.js';
import { isMeasureType } from './utils.js';
import { UserFlow } from 'lighthouse';

export class UserFlowRunnerExtension extends PuppeteerRunnerExtension {
  constructor(
    browser: Browser,
    page: Page,
    private flow: UserFlow,
    opts?: {
      timeout?: number;
    },
  ) {
    super(browser, page, opts);
  }

  override async runStep(
    step: UserFlowRecordingStep,
    flowRecording: UserFlowRecording,
  ): Promise<void> {
    if (!isMeasureType(step.type)) {
      return super.runStep(step as Step, flowRecording);
    }
    const userFlowStep = step as MeasurementStep;
    const stepOptions = userFlowStep?.stepOptions;
    return this.flow[userFlowStep.type]({ ...stepOptions });
  }
}
