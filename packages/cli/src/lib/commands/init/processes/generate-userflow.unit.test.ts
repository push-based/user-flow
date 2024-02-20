import { Buffer } from 'node:buffer';
import { prompt } from 'enquirer';
import { INITIATED_RC_JSON } from 'test-data';
import { handleFlowGeneration } from './generate-userflow';
import fs = require('node:fs');

jest.mock('node:fs');
jest.mock('enquirer', () => ({
  prompt: jest.fn().mockResolvedValue(false),
}));

describe('generate userflow', () => {

  afterEach(() => {
    jest.resetAllMocks();
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

  // [nf] init --interactive => [P]: "Setup user flow" -> Y:[F]/n[nF]
  it('should prompt with --interactive if file does not exists', async () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    await handleFlowGeneration({interactive: true})(INITIATED_RC_JSON);
    expect(existsSyncSpy).toHaveBeenCalled();
    expect(prompt).toHaveBeenCalled();
  });

  // [f] init --interactive => [L]: "File already here"; [nF]
  it('should not prompt with --interactive if file exists',async () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const isDirectorySpy = jest.spyOn(fs, 'lstatSync').mockReturnValue({ isDirectory: () => false } as fs.Stats);
    const readFileSyncSpy = jest.spyOn(fs, 'readFileSync').mockReturnValue('Dummy Flow');
    await handleFlowGeneration({interactive: true})(INITIATED_RC_JSON);
    expect(existsSyncSpy).toHaveBeenCalled();
    expect(isDirectorySpy).toHaveBeenCalled();
    expect(readFileSyncSpy).toHaveBeenCalled();
    expect(prompt).toHaveBeenCalledTimes(0);
  });

  // [f] init --no-interactive => [N]
  it('should not prompt with --no-interactive if file exists',async () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');
    await handleFlowGeneration({interactive: false})(INITIATED_RC_JSON);
    expect(existsSyncSpy).toHaveBeenCalledTimes(0);
    expect(writeFileSyncSpy).toHaveBeenCalledTimes(0);
    expect(prompt).toHaveBeenCalledTimes(0);
  });

  // [nf] init --no-interactive => [N]
  it('should not prompt with --no-interactive if file does not exists', async () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');
    await handleFlowGeneration({interactive: false})(INITIATED_RC_JSON);
    expect(existsSyncSpy).toHaveBeenCalledTimes(0);
    expect(writeFileSyncSpy).toHaveBeenCalledTimes(0);
    expect(prompt).toHaveBeenCalledTimes(0);
  });

  // [nf] init --interactive --generateFlow => [L]: "File already here"; [nF]
  it('should create flow when --generateFlow is used', async () => {
    jest.spyOn(fs, 'readdirSync').mockReturnValue([]);
    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false).mockReturnValue(true);
    jest.spyOn(fs, 'lstatSync').mockReturnValue({ isDirectory: () => false } as fs.Stats);
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(Buffer.from(''));
    const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');
    await handleFlowGeneration({interactive: true, generateFlow: true})(INITIATED_RC_JSON);
    expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
  });

  // [f] init --interactive --no-generateFlow => [N]
  it('should not create flow when --no-generateFlow is used', async () => {
    const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');
    await handleFlowGeneration({interactive: true, generateFlow: false})(INITIATED_RC_JSON);
    expect(writeFileSyncSpy).toHaveBeenCalledTimes(0);
  });
});
