import { createRunner, Runner } from '@puppeteer/replay';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { UserFlow } from 'lighthouse/lighthouse-core/fraggle-rock/user-flow';
import { UserFlowContext } from '../../../../index.js';
import { readFile } from '../../../../core/file/index.js';
import { UserFlowReportJson } from './types.js';
import { UserFlowRunnerExtension } from './runner-extension.js';
import { parse } from './parse.js';

export async function createUserFlowRunner(path: string, ctx: UserFlowContext): Promise<Runner> {
    const {browser, page, flow} = ctx;
    const runnerExtension = new UserFlowRunnerExtension(browser, page, flow);
    const jsonRecording = readFile<UserFlowReportJson>(path, {ext: 'json'});
    const recording = parse(jsonRecording);
    return await createRunner(recording as UserFlow, runnerExtension);
}
