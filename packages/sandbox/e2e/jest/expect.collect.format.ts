import { join, basename } from 'path';
import { UserFlowCliProject } from '@push-based/user-flow-cli-testing';

export function expectCollectCommandCreatesHtmlReport(
  prj: UserFlowCliProject,
  userFlowName: string,
  flowTitle: string,
  rcName?: string
) {
  const reportHTML = prj.readOutput(userFlowName, 'html', rcName)[0].content;
  expect(reportHTML).toContain(flowTitle);
}

export function expectCollectCommandCreatesJsonReport(
  prj: UserFlowCliProject,
  reportName: string,
  flowTitle: string,
  rcName?: string
) {
  const reportJson = prj.readOutput(reportName,'json', rcName)[0].content as any;
  expect(reportJson.name).toContain(flowTitle);
}


export function expectCollectLogsReport(stdout: string, ufName: string) {
  expect(stdout).toContain(`| Gather Mode | Performance | Accessibility | Best Practices | Seo | Pwa |`);
  expect(stdout).toContain(ufName);
}
export function expectCollectCommandCreatesMdReport(
  prj: UserFlowCliProject,
  reportName: string,
  flowTitle: string,
  rcName?: string
) {
  const reportMd = prj.readOutput(reportName, 'md', rcName)[0].content;
  expect(reportMd).toContain(flowTitle);
  expect(reportMd).toContain(`| Gather Mode | Performance | Accessibility | Best Practices | Seo | Pwa |`);
}

export function expectCollectCommandNotToCreateReport(
  prj: UserFlowCliProject,
  reportName: string,
  rcName?: string
) {
  // Check report file is not created
  try {
    prj.readOutput(reportName, undefined, rcName);
  } catch (e: any) {
    expect(e.message).toContain('no such file or directory');
  }
}

export function expectPersistedReports(prj: UserFlowCliProject, resultingReportNames: string[]) {
  const flowNames: string[] = prj.readUserFlow(prj.outputPath()).map(([p]) => join(prj.readRcJson().persist.outPath, basename(p)));
  // expect(flowNames).toBe('flowNames')
  const formats = prj.readRcJson().persist.format.filter(f => f !== 'stdout');
  const userFlowNames = flowNames.map(f => f.slice(0, -6)); // xyz(.uf.ts)
  const expectedFileNames = userFlowNames.flatMap(flowName => formats.map(format => `${flowName}.${format}`)) || [];

  expect(resultingReportNames.sort()).toEqual(expectedFileNames.sort());
}
