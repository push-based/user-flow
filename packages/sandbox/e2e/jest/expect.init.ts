export function expectInitOptionsToBeContainedInStdout(stdout: string, cliParams: {}) {
  expect(stdout).toContain(`Init options:`);
  Object.entries(cliParams).forEach(([k, v]) => {
    switch (k) {
      // collect
      case 'url':
      case 'ufPath':
      case 'outPath':
      case 'serveCommand':
      case 'awaitServeStdout':
      case 'budgetPath':
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
        throw new Error(`${k} handling not implemented for init configuration check`);
        break;
    }
  });
}
