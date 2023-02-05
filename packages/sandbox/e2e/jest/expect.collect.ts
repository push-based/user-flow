import { UserFlowCliProject } from '@push-based/user-flow-cli-testing';

export function expectCollectCommandNotToCreateLogsFromMockInStdout(
  prj: UserFlowCliProject,
  userFlowName: string,
  stdout: string,
  rcName?: string) {
  const rcJson = prj.readRcJson(rcName);
  expect(stdout).not.toContain(`Collect: ${userFlowName} from URL ${rcJson.collect.url}`);
  expect(stdout).not.toContain(`flow#navigate: ${rcJson.collect.url}`);
  expect(stdout).not.toContain(`Duration: ${userFlowName}`);
}

export function expectCollectLogsFromMockInStdout(stdout: string, prj: UserFlowCliProject, reportName: string, rcName?: string) {
  const rcJson = prj.readRcJson(rcName);
  const reportTitle = reportName.slice(0, -3);
  expect(stdout).toContain(`Collect: ${reportTitle} from URL ${rcJson.collect.url}`);
  expect(stdout).toContain(`flow#navigate: ${rcJson.collect.url}`);
  expect(stdout).toContain(`Duration: ${reportTitle}`);
}

export function expectCollectCfgToContain(stdout: string, cliParams: {}) {
  expect(stdout).toContain(`Collect options:`);
  Object.entries(cliParams).forEach(([k, v]) => {
    switch (k) {
      // collect
      case 'url':
      case 'ufPath':
      case 'outPath':
      case 'serveCommand':
      case 'awaitServeStdout':
      case 'budgetPath':
      case 'configPath':
      case 'config':
        expect(stdout).toContain(`${k}: '${v}'`);
        break;
      case 'format':
        let values = (v as any[]).map(i => '\'' + i + '\'').join(', ');
        values = values !== '' ? ' ' + values + ' ' : values;
        expect(stdout).toContain(`${k}: [${values}]`);
        break;
      case 'openReport':
      case 'dryRun':
        expect(stdout).toContain(`${k}: ${v}`);
        break;
      default:
        throw new Error(`${k} handling not implemented for collect configuration check`);
        break;
    }
  });
}
