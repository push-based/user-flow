import { createRunner, Runner, UserFlow } from '@puppeteer/replay';
import { Browser, Page } from 'puppeteer';
// @ts-ignore
import { UserFlow as LhUserFlow } from 'lighthouse/lighthouse-core/fraggle-rock/user-flow';
import { parse } from './utils';
import { UserFlowExtension } from './runner-extension';
import { readFile } from '../../../../core/utils/file';

export async function createUserFlowRunner(path: string, ctx: { browser: Browser, page: Page, lhFlow: LhUserFlow }): Promise<Runner> {
  const { browser, page, lhFlow } = ctx;
  const runnerExtension = new UserFlowExtension(browser, page, lhFlow);
  const recording = parse(readFile(path, { ext: 'json' }) as UserFlow);
  return await createRunner(recording, runnerExtension);
}
