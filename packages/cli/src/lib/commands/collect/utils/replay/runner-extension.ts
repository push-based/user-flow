import {PuppeteerRunnerExtension, Step, UserFlow} from "@puppeteer/replay";
import {Browser, Page} from "puppeteer";
import {MeasureModes} from "./types";
import {isMeasureType} from "./utils";

export class UserFlowExtension extends PuppeteerRunnerExtension {

    constructor(browser: Browser, page: Page, private lhFlow: LhUserFlow, opts?: {
        timeout?: number;
    }) {
        super(browser, page, opts);
    }

    // eslint-disable-next-line
    // @ts-ignore
    async runStep(step: Step | { type: MeasureModes }, flow: UserFlow): Promise<void> {

        if (isMeasureType(step.type)) {
            return this.lhFlow[step.type]();
        } else {
            return super.runStep(step as Step, flow);
        }

    }
}
