import {PuppeteerRunnerExtension, Step, UserFlow as UserFlowRecording} from "@puppeteer/replay";
import {Browser, Page} from "puppeteer";
import { MeasurementStep, UserFlowRecordingStep } from './types.js';
import {isMeasureType} from "./utils.js";
// @ts-ignore
import {UserFlow} from 'lighthouse';

export class UserFlowRunnerExtension extends PuppeteerRunnerExtension {

    constructor(browser: Browser, page: Page, private flow: UserFlow, opts?: {
        timeout?: number;
    }) {
        super(browser, page, opts);
    }

  override async runStep(step: UserFlowRecordingStep, flowRecording: UserFlowRecording): Promise<void> {
        if (isMeasureType(step.type) && !this.flow?.currentTimespan) {
            const userFlowStep = step as MeasurementStep;
            const stepOptions = userFlowStep?.stepOptions;
            if (userFlowStep.type === 'navigate') {
              // TODO fix (Changes to Flow API)
                // @ts-ignore
              return this.flow[userFlowStep.type](userFlowStep?.url, {...stepOptions});
            }
            // TODO fix (Changes to Flow API)
            // @ts-ignore
          return this.flow[userFlowStep.type]({...stepOptions});
        } else {
            return super.runStep(step as Step, flowRecording);
        }
    }
}
