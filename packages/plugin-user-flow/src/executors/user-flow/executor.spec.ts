import {UserFlowExecutorSchema} from './schema';
import executor from './executor';

const options: UserFlowExecutorSchema = {
  outputPath: 'outputPathoutputPath'
};
describe('Test Executor', () => {
  it('can run', async () => {
    const execResult = await executor(options, {} as any);
    expect(execResult.success).toBe(true);
    expect(outputContainsConfig(execResult.output, {
      verbose: true,
      // test alias for outputPath
      outPath: 'outputPathoutputPath'})).toBe(true);
  })
});
function outputContainsConfig(output: string, config: Record<string, unknown>): boolean {

  Object.entries(config).forEach(([k, v]) => {
    let contains = true;
    switch (k) {
      case 'rcPath':
      case 'url':
      case 'ufPath':
      case 'outPath':
      case 'serveCommand':
      case 'awaitServeStdout':
      case 'budgetPath':
      case 'configPath':
        contains = output.includes(`${k}: '${v}'`);
        break;
      case 'config':
        contains = output.includes(`${k}: { `);
        break;
      case 'format':
        // eslint-disable-next-line no-case-declarations
        let values = (v as any[]).map(i => '\'' + i + '\'').join(', ') || '';
        values = values !== '' ? ' ' + values + ' ' : values;
        contains = output.includes(`${k}: [${values}]`);
        break;
      case 'verbose':
      case 'interactive':
      case 'openReport':
      case 'dryRun':
        contains = output.includes(`${k}: ${v}`);
        break;
      default:
        throw new Error(`${k} handling not implemented for configuration check`);
        break;
    }
    if(!contains) {
      throw new Error(`${k} not present in output ${output}`);
    }
  });
  return true;
}
