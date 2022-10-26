import { createRunner, Runner, UserFlow, UserFlow as UserFlowReport } from '@puppeteer/replay';
import {Browser, Page} from 'puppeteer';
// @ts-ignore
import {UserFlow as LhUserFlow} from 'lighthouse/lighthouse-core/fraggle-rock/user-flow';
import {readFile} from '../../../../core/utils/file/file';
import {parse} from "./utils";
import {UserFlowExtension} from "./runner-extension";
import { UserFlowReportJson } from './types';

export async function createUserFlowRunner(path: string, ctx: { browser: Browser, page: Page, lhFlow: LhUserFlow }): Promise<Runner> {
    const {browser, page, lhFlow} = ctx;
    const runnerExtension = new UserFlowExtension(browser, page, lhFlow);
    const jsonRecording = readFile(path, {ext: 'json'}) as UserFlowReportJson;
    const recording: UserFlow = parse(jsonRecording) as UserFlow;
    return await createRunner(recording, runnerExtension);
}
