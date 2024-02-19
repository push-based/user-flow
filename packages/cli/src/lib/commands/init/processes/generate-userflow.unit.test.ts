import { INITIATED_RC_JSON } from 'test-data';
import { handleFlowGeneration } from './generate-userflow';
import { PathLike } from 'node:fs';
import { fileSystemManager, FileSystemManager } from '../../../core/file';

describe('generate userflow', () => {
  let fSM: FileSystemManager;

  beforeAll(() => {
    jest.mock((''))
  })
  beforeEach(() => {
    fSM = fileSystemManager
  })

  /**
   * Legend:
   * - [nf] - flow file does not exist
   * - [f] - flow file does exist
   * - [F] - flow file creation
   * - [nF] - no flow file creation
   * - [P] - Prompt executes
   * - [L] - Log occurs
   * - [N] - no operation
   *
   * Cases:
   * [nf] init --interactive => [P]: "Setup user flow" -> Y:[F]/n[nF],
   * [f] init --interactive => [L]: "File already here"; [nF]
   * [nf] init --no-interactive => [N]
   * [f] init --no-interactive => [N]
   * [nf] init --interactive --generateFlow => [L]: "File already here"; [nF]
   * [f] init --interactive --generateFlow => [F]
   * [f] init --interactive --no-generateFlow => [N]
   *
   */

  /*
  @TODO create a test helper for functions with prompt side effects
  // [nf] init --interactive => [P]: "Setup user flow" -> Y:[F]/n[nF]
  it('should prompt with --interactive', withUserFlowProject(EMPTY_PRJ_CFG, async (_) => {
    const expectedFilePath = join(INITIATED_PRJ_CFG.root, INITIATED_RC_JSON.collect.ufPath,'basic-navigation.uf.ts');
    expect(existsSync(expectedFilePath)).toBeFalsy();
    let o = '';
    (console as any).log = (...v) => o += v.join(', ')
    await handleFlowGeneration({interactive: true})(INITIATED_RC_JSON);
    expect(o).toContain('Setup user flow')
    expect(existsSync(expectedFilePath)).toBeTruthy();
    })
  );*/

  // [f] init --interactive => [L]: "File already here"; [nF]
  it('should not prompt with --interactive if file exists',async () => {
    fSM.existSync = (path: PathLike): boolean => true;
    const spy = jest.spyOn(fSM, 'existSync');
    await handleFlowGeneration({interactive: true}, fSM )(INITIATED_RC_JSON);
    expect(spy).toHaveBeenCalled();
  });

  // [f] init --no-interactive => [N]
  it('should not prompt with --no-interactive', async () => {
    fSM.existSync = (path: PathLike): boolean => true;
    const spy = jest.spyOn(fSM, 'existSync');
    await handleFlowGeneration({interactive: false}, fSM)(INITIATED_RC_JSON);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  // [nf] init --no-interactive => [N]
  it('should not prompt with --no-interactive', async () => {
    fSM.existSync = (path: PathLike): boolean => false;
    const spy = jest.spyOn(fSM, 'existSync');
    await handleFlowGeneration({interactive: false}, fSM)(INITIATED_RC_JSON);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  // [nf] init --interactive --generateFlow => [L]: "File already here"; [nF]
  it('should create flow when --generateFlow is used',async () => {
    fSM.existSync = (path: PathLike): boolean => true;
    fSM.writeFile = (filePath: string, data: string) => {};
    fSM.readdirSync = (path: PathLike) => [''] as any;
    fSM.readFile = (path: PathLike) => '' as any;
    const spy = jest.spyOn(fSM, 'writeFile');
    await handleFlowGeneration({interactive: true, generateFlow: true}, fSM)(INITIATED_RC_JSON);
    expect(spy).toHaveBeenCalled();
  });

  // [f] init --interactive --no-generateFlow => [N]
  it('should not create flow when --no-generateFlow is used', async () => {
    fSM.existSync = (path: PathLike): boolean => true;
    fSM.writeFile = (filePath: string, data: string) => {};
    const spy = jest.spyOn(fSM, 'writeFile');
    await handleFlowGeneration({interactive: true, generateFlow: false}, fSM)(INITIATED_RC_JSON);
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
