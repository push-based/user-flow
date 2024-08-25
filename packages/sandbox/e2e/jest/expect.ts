import { GlobalOptionsArgv } from '@push-based/user-flow';
import { quoted, unquoted } from './utils';

export function expectGlobalConfigPathUsageLog(stdout: string, configPath: string = '') {
  expect(stdout).toContain(`LH Configuration ${configPath} is used from CLI param or .user-flowrc.json`);
}
export function expectGlobalConfigUsageLog(stdout: string) {
  expect(stdout).toContain(`LH Configuration is used from config property .user-flowrc.json`);
}

export function expectNoConfigFileExistLog(stdout: string) {
  expect(stdout).not.toContain(`CLI options --configPath or .user-flowrc.json configuration`);
  expect(stdout).not.toContain('.user-flowrc.json configuration is used instead of a potential configuration in the user flow');
  expect(stdout).not.toContain('Use config from UserFlowProvider objects under the flowOptions property');
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
