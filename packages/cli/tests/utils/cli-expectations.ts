import { UserFlowRcConfig } from '@push-based/user-flow/cli';
import {
  INIT_COMMAND__ASK_FROMAT,
  INIT_COMMAND__ASK_OUT_PATH,
  INIT_COMMAND__ASK_UF_PATH,
  INIT_COMMAND__ASK_URL,
  INIT_COMMAND__SETUP_CONFIRM
} from '../fixtures/cli-prompts';
import * as fs from 'fs';
import {
  EMPTY_SANDBOX_RC_JSON__AFTER_ENTER_DEFAULTS,
  EMPTY_SANDBOX_RC_NAME__AFTER_ENTER_DEFAULTS
} from '../fixtures/empty-sandbox';

export function expectOutputRcInStdout(stdout: string, cfg: UserFlowRcConfig) {
  expect(stdout).toContain(INIT_COMMAND__SETUP_CONFIRM);
  expect(stdout).toContain(`url: '${cfg.collect.url}'`);
  expect(stdout).toContain(`ufPath: '${cfg.collect.ufPath}'`);
  expect(stdout).toContain(`outPath: '${cfg.persist.outPath}'`);
  expect(stdout).toContain(`format: [ '${cfg.persist.format[0]}', '${cfg.persist.format[1]}' ]`);
}

export function expectNoPromptsInStdout(stdout: string) {
  expect(stdout).not.toContain(INIT_COMMAND__ASK_URL);
  expect(stdout).not.toContain(INIT_COMMAND__ASK_UF_PATH);
  expect(stdout).not.toContain(INIT_COMMAND__ASK_OUT_PATH);
  expect(stdout).not.toContain(INIT_COMMAND__ASK_FROMAT);
}

export function expectPromptsInStdout(stdout: string) {
  expect(stdout).toContain(INIT_COMMAND__ASK_URL);
  expect(stdout).toContain(INIT_COMMAND__ASK_UF_PATH);
  expect(stdout).toContain(INIT_COMMAND__ASK_OUT_PATH);
  expect(stdout).toContain(INIT_COMMAND__ASK_FROMAT);
}

export function expectCollectLogsInStdout(stdout: string, ufName: string, cfg: UserFlowRcConfig) {
  expect(stdout).toContain(`Collect: ${ufName} from URL ${cfg.collect.url}`);
  expect(stdout).toContain(`flow#navigate: ${cfg.collect.url}`);
  expect(stdout).toContain(`Duration: ${ufName}`);
}

export function expectCollectCreatesHtmlReport(reportPath: string, ufName: string) {
  const reportHTML = fs.readFileSync(reportPath).toString('utf8');
  expect(reportHTML).toBeTruthy();
  expect(reportHTML).toContain(`${ufName}`);
}

export function expectCollectNotToCreateAReport(reportPath: string) {
  // Check report file is not created
  try {
    fs.readFileSync(reportPath).toString('utf8');
  } catch (e: any) {
    expect(e.message).toContain('no such file or directory');
  }
}

export function expectCollectToCreateRc(rcPath: string, cfg: UserFlowRcConfig) {
  const config = JSON.parse(fs.readFileSync(rcPath) as any);
  expect(config).toEqual(cfg);
}
