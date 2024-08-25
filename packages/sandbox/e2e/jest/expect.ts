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
