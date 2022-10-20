import {
  createRunner,
  parse,
  Runner,
  Step,
  UserFlow,
  LighthouseRunnerExtension
} from '@puppeteer/replay';
import { Browser, Page } from 'puppeteer';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { UserFlow as LhUserFlow } from 'lighthouse/lighthouse-core/fraggle-rock/user-flow';
import { MeasureModes } from './types';
import { readFile } from '../../../../core/utils/file';

export class UserFlowExtension extends LighthouseRunnerExtension {

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

export function isMeasureType(str: string) {
  switch (str) {
    case 'navigation':
    case 'snapshot':
    case 'startTimespan':
    case 'stopTimespan':
      return true;
    default:
      return false;
  }
}

export function parseUserFlowRecording(recordingJson: { title: string, steps: {}[] }): UserFlow {
  const ufArr: Step[] = [];
  // filter out user-flow specific actions
  const steps = recordingJson.steps.filter(
    (value: any, index) => {
      if (isMeasureType(value?.type)) {
        ufArr[index] = value;
        return false;
      }
      return true;
    }
  );
  // parse the clean steps
  const parsed = parse({ ...recordingJson, steps });
  // add in user-flow specific actions
  ufArr.forEach((value, index) => {
    value && (parsed.steps[index] = value);
  });
  return parsed;
}

export async function createUserFlowRunner(path: string, ctx: { browser: Browser, page: Page, lhFlow: LhUserFlow }): Promise<Runner> {
  const { browser, page, lhFlow } = ctx;
  const userflowRunnerExtension = new UserFlowExtension(browser, page, lhFlow);
 const z =  readFile(path, { ext: 'json' });
  const recording = parseUserFlowRecording(readFile(path, { ext: 'json' }));
  return await createRunner(recording, userflowRunnerExtension);
}
