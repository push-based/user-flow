import { createRunner, Runner } from '@puppeteer/replay';
// @ts-ignore
import {UserFlow} from 'lighthouse/lighthouse-core/fraggle-rock/user-flow';
import {readFile} from '../../../../core/utils/file/file';
import {UserFlowRunnerExtension} from "./runner-extension";
import { UserFlowContext } from '../../../..';
import {parse} from "./utils";
import { UserFlowReportJson } from './types';

export async function createUserFlowRunner(path: string, ctx: UserFlowContext): Promise<Runner> {
    const {browser, page, flow} = ctx;
    const runnerExtension = new UserFlowRunnerExtension(browser, page, flow);
    const jsonRecording = readFile(path, {ext: 'json'}) as UserFlowReportJson;
    const recording: UserFlow = parse(jsonRecording);
    return await createRunner(recording, runnerExtension);
}
