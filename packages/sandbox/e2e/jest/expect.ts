import {UserFlowCliProject} from '@push-based/user-flow-cli-testing';
import {LH_CONFIG_NAME} from 'test-data';
import {
  DEFAULT_RC_NAME,
  GlobalOptionsArgv,
  RcJson,
  SETUP_CONFIRM_MESSAGE,
} from '@push-based/user-flow';
import {quoted, unquoted} from './utils';

export function expectGlobalConfigPathUsageLog(
  stdout: string,
  configPath: string = ''
) {
  expect(stdout).toContain(
    `LH Configuration ${configPath} is used from CLI param or .user-flowrc.json`
  );
}

export function expectGlobalConfigUsageLog(stdout: string) {
  expect(stdout).toContain(
    `LH Configuration is used from config property .user-flowrc.json`
  );
}

export function expectNoConfigFileExistLog(stdout: string) {
  expect(stdout).not.toContain(
    `CLI options --configPath or .user-flowrc.json configuration`
  );
  expect(stdout).not.toContain(
    '.user-flowrc.json configuration is used instead of a potential configuration in the user flow'
  );
  expect(stdout).not.toContain(
    'Use config from UserFlowProvider objects under the flowOptions property'
  );
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

export function expectGlobalOptionsToBeContainedInStdout(
  stdout: string,
  globalParams: Partial<GlobalOptionsArgv>
) {
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
        throw new Error(
          `${k} handling not implemented for global options check`
        );
        break;
    }
  });
}

export function expectResultsToIncludeConfig(
  prj: UserFlowCliProject,
  reportName: string,
  config: string = LH_CONFIG_NAME
) {
  const report = prj.readOutput(reportName, 'json')[0].content as any;
  const resolvedConfig = prj.readConfig(config);
  expect(report.steps[0].lhr.configSettings).toEqual(resolvedConfig);
}

export function expectOutputRcInStdout(stdout: string, cfg: RcJson) {
  expect(stdout).toContain(`url: '${cfg.collect.url}'`);
  expect(stdout).toContain(`ufPath: '${cfg.collect.ufPath}'`);
  expect(stdout).toContain(`outPath: '${cfg.persist.outPath}'`);
  expect(stdout).toContain(`format: [ '${cfg.persist.format[0]}' ]`);
  expect(stdout).toContain(SETUP_CONFIRM_MESSAGE);
}
