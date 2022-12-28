import { UserFlowCliProject, DEFAULT_RC_NAME } from '@push-based/user-flow-cli-testing';
import { LH_CONFIG_NAME } from 'test-data';
import { GlobalOptionsArgv } from '@push-based/user-flow';
import { SETUP_CONFIRM_MESSAGE } from '@push-based/user-flow';
import { RcJson } from '@push-based/user-flow';
import { quoted, unquoted } from './utils';

export function expectResultsToIncludeConfig(prj: UserFlowCliProject, reportName: string, config: string = LH_CONFIG_NAME) {
  const report = prj.readOutput(reportName) as any;
  const resolvedConfig = prj.readConfig(config);
  expect(report.steps[0].lhr.configSettings).toEqual(resolvedConfig);
}

export function expectConfigPathUsageLog(stdout: string, configPath: string = '') {
  expect(stdout).toContain(`Configuration ${configPath} is used instead of a potential configuration in the user-flow.uf.ts`);
}

export function expectNoConfigFileExistLog(stdout: string) {
  expect(stdout).not.toContain(`CLI options --configPath or .user-flowrc.json configuration`);
  expect(stdout).not.toContain('.user-flowrc.json configuration is used instead of a potential configuration in the user flow');
  expect(stdout).not.toContain('Use config from UserFlowProvider objects under the flowOptions property');
}

export function expectCliToCreateRc(
  prj: UserFlowCliProject,
  json: RcJson,
  rcName: string = DEFAULT_RC_NAME
) {
  const rcFromFile = prj.readRcJson(rcName);
  // handle inconsistency of rc vs params
  const { collect, persist, assert } = json;
  expect(rcFromFile).toEqual({ collect, persist, assert });
}

export function expectGlobalOptionsToBeContainedInStdout(stdout: string, globalParams: Partial<GlobalOptionsArgv>) {
  Object.entries(globalParams).forEach(([k, v]) => {
    v = '' + v;
    switch (k as keyof GlobalOptionsArgv) {
      case 'rcPath':
        expect(stdout).toContain(quoted(k, v));
        break;
      case 'interactive':
      case 'verbose':
        expect(stdout).toContain(unquoted(k, v));
        break;
      default:
        throw new Error(`${k} handling not implemented for global options check`);
        break;
    }
  });
}

export function expectOutputRcInStdout(stdout: string, cfg: RcJson) {
  expect(stdout).toContain(`url: '${cfg.collect.url}'`);
  expect(stdout).toContain(`ufPath: '${cfg.collect.ufPath}'`);
  expect(stdout).toContain(`outPath: '${cfg.persist.outPath}'`);
  expect(stdout).toContain(`format: [ '${cfg.persist.format[0]}' ]`);
  expect(stdout).toContain(SETUP_CONFIRM_MESSAGE);
}

