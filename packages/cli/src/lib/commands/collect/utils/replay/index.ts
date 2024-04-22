import { createRunner, Runner, UserFlow as PRUserFlow } from '@puppeteer/replay';
import { UserFlowContext } from '../../../..';
import { readFile } from '../../../../core/file';
import { UserFlowReportJson } from './types';
import { UserFlowRunnerExtension } from './runner-extension';
import { parse } from './parse';

export async function createUserFlowRunner(path: string, ctx: UserFlowContext): Promise<Runner> {
    const {browser, page, flow} = ctx;
    const runnerExtension = new UserFlowRunnerExtension(browser, page, flow);
    const jsonRecording = readFile<UserFlowReportJson>(path, {ext: 'json'});
    const recording = parse(jsonRecording);
    return await createRunner(recording as PRUserFlow, runnerExtension);
}
