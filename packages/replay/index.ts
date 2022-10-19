import {createRunner, parse, PuppeteerRunnerExtension, Runner, Step, UserFlow} from "@puppeteer/replay";
import {Browser, Page} from "puppeteer";
import {readFileSync} from "fs";

/**
 *  'navigation' is already covered by `@puppeteer/replay`
 */
export type measureModes = 'snapshot' | 'startTimespan' | 'stopTimespan';

// try to extend `LighthouseRunnerExtension` it has already some edge case handling for time spans

export class UserFlowExtension extends PuppeteerRunnerExtension {

  constructor(browser: Browser, page: Page, private lhFlow: {
    startTimespan: () => void,
    stopTimespan: () => void,
    snapshot: () => void
    navigation: () => void
  }, opts?: {
    timeout?: number;
  }) {
    super(browser, page, opts);
  }

  async runStep(step: Step | { type: measureModes }, flow: UserFlow): Promise<void> {

    if (isMeasureType(step.type)) {
      return this.lhFlow[step.type]();
    } else {
      return super.runStep(step as Step, flow);
    }

  }
}

export function isMeasureType(str: string) {
  switch (str) {
    case "navigation":
    case "snapshot":
    case "startTimespan":
    case "stopTimespan":
      return true
    default:
      return false;
  }
}

export function parseUserFlowRecording(recordingJson: { title: string, steps: {}[] }): UserFlow {
  const ufArr = [];
  // filter out user-flow specific actions
  const steps = recordingJson.steps.filter(
    (value: any, index) => {
      if (isMeasureType(value?.type)) {
        ufArr[index] = value;
        return false
      }
      return true
    }
  );
  // parse the clean steps
  const parsed = parse({...recordingJson, steps});
  // add in user-flow specific actions
  ufArr.forEach((value, index) => {
    value && (parsed.steps[index] = value);
  })
  return parsed;
}

export async function createUserFlowRunner(path: string, {browser, page, lhFlow}): Promise<Runner> {
  const userflowRunnerExtension = new UserFlowExtension(browser, page, lhFlow);
  const recordingText = readFileSync(path, 'utf8');
  const recording = parseUserFlowRecording(JSON.parse(recordingText));
  return await createRunner(recording, userflowRunnerExtension);
}
