import {PuppeteerRunnerExtension, Step, UserFlow} from "@puppeteer/replay";
import {Browser, Page} from "puppeteer";
import {UserFlowRunnerStep} from "./types";
import {isMeasureType} from "./utils";
// @ts-ignore
import {UserFlow as LhUserFlow} from 'lighthouse/lighthouse-core/fraggle-rock/user-flow';

export class UserFlowExtension extends PuppeteerRunnerExtension {

    constructor(browser: Browser, page: Page, private lhFlow: LhUserFlow, opts?: {
        timeout?: number;
    }) {
        super(browser, page, opts);
    }

    // eslint-disable-next-line
    // @ts-ignore
    async runStep(step: Step | UserFlowRunnerStep, flow: UserFlow): Promise<void> {

        if (isMeasureType(step.type) &&
            (step.type !== 'navigate' || !this.lhFlow?.currentTimespan)
        ) {
            const userFlowStep = step as UserFlowRunnerStep;
            const stepOptions = userFlowStep?.stepOptions;
            if (userFlowStep.type === 'navigate') {
                console.log("Step = ", userFlowStep.type, userFlowStep?.url, {...stepOptions});
                return this.lhFlow[userFlowStep.type](userFlowStep?.url, {...stepOptions});
            }
            console.log("Step|= ", userFlowStep.type, {...stepOptions});
            return this.lhFlow[userFlowStep.type]({...stepOptions});
        } else {
            return super.runStep(step as Step, flow);
        }

    }
}
