import { createRunner, Runner } from '@puppeteer/replay';
// @ts-ignore
import { UserFlow } from 'lighthouse/lighthouse-core/fraggle-rock/user-flow';
import { UserFlowContext } from '../../../..';
import { readFile } from '../../../../core/utils/file/file';
import { UserFlowReportJson } from './types';
import { parse } from './utils';
import { UserFlowRunnerExtension } from './runner-extension';

export async function createUserFlowRunner(path: string, ctx: UserFlowContext): Promise<Runner> {
    const {browser, page, flow} = ctx;
    const runnerExtension = new UserFlowRunnerExtension(browser, page, flow);
    const jsonRecording = readFile<UserFlowReportJson>(path, {ext: 'json'});
    const recording = parse(jsonRecording);
    return await createRunner(recording as UserFlow, runnerExtension);
}