import { INITIATED_PRJ_CFG, INITIATED_RC_JSON, EMPTY_PRJ_CFG } from 'test-data';
import { handleFlowGeneration } from './generate-userflow';
import { existsSync } from 'fs';
import { join } from 'path';
import { withUserFlowProject } from '@push-based/user-flow-cli-testing';

let originalCwd = process.cwd();

describe('generate userflow', () => {

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

  beforeAll(() => {
    process.chdir(INITIATED_PRJ_CFG.root);
  });
  afterAll(() => {
    process.chdir(originalCwd);
  });

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
  it('should not prompt with --interactive if file exists', withUserFlowProject(INITIATED_PRJ_CFG, async () => {
    const expectedFilePath = join(INITIATED_PRJ_CFG.root, INITIATED_RC_JSON.collect.ufPath,'basic-navigation.uf.ts');
    expect(existsSync(expectedFilePath)).toBeTruthy();
    await handleFlowGeneration({interactive: true})(INITIATED_RC_JSON);
    expect(existsSync(expectedFilePath)).toBeTruthy();
  }));

  // [f] init --no-interactive => [N]
  it('should not prompt with --no-interactive if file exists', withUserFlowProject(INITIATED_PRJ_CFG, async () => {
    const expectedFilePath = join(INITIATED_PRJ_CFG.root, INITIATED_RC_JSON.collect.ufPath,'basic-navigation.uf.ts');
    expect(existsSync(expectedFilePath)).toBeTruthy();
    await handleFlowGeneration({interactive: false})(INITIATED_RC_JSON);
    expect(existsSync(expectedFilePath)).toBeTruthy();
  }));

  // [nf] init --no-interactive => [N]
  it('should not prompt with --no-interactive if file does not exists', withUserFlowProject(EMPTY_PRJ_CFG, async () => {
    const expectedFilePath = join(INITIATED_PRJ_CFG.root, INITIATED_RC_JSON.collect.ufPath,'basic-navigation.uf.ts');
    expect(existsSync(expectedFilePath)).toBeFalsy();
    await handleFlowGeneration({interactive: false})(INITIATED_RC_JSON);
    expect(existsSync(expectedFilePath)).toBeFalsy();
  }));

  // [nf] init --interactive --generateFlow => [L]: "File already here"; [nF]
  it('should create flow when --generateFlow is used', withUserFlowProject(EMPTY_PRJ_CFG, async () => {
    const expectedFilePath = join(INITIATED_PRJ_CFG.root, INITIATED_RC_JSON.collect.ufPath,'basic-navigation.uf.ts');
    expect(existsSync(expectedFilePath)).toBeFalsy();
    await handleFlowGeneration({interactive: true, generateFlow: true})(INITIATED_RC_JSON);
    expect(existsSync(expectedFilePath)).toBeTruthy();
  }));

  // [f] init --interactive --no-generateFlow => [N]
  it('should not create flow when --no-generateFlow is used', withUserFlowProject(EMPTY_PRJ_CFG, async () => {
    const expectedFilePath = join(INITIATED_PRJ_CFG.root, INITIATED_RC_JSON.collect.ufPath,'basic-navigation.uf.ts');
    expect(existsSync(expectedFilePath)).toBeFalsy();
    await handleFlowGeneration({interactive: true, generateFlow: false})(INITIATED_RC_JSON);
    expect(existsSync(expectedFilePath)).toBeFalsy();
  }));

});
