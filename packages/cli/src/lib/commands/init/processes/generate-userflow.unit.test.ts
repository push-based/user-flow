import { describe, afterEach, it, expect, vi } from 'vitest';
import { Buffer } from 'node:buffer';
import * as fs from 'node:fs';
import { prompt } from 'enquirer';
import { INITIATED_RC_JSON } from 'test-data';
import { handleFlowGeneration } from './generate-userflow.js';

vi.mock('node:fs');
vi.mock('enquirer', () => ({
  prompt: vi.fn().mockResolvedValue(false),
}));
vi.mock('../../../core/loggin');

describe('handleFlowGeneration', () => {

  afterEach(() => {
    vi.clearAllMocks();
  })

  it('should prompt if not passed generateFlow and has interactive true and file does not already exist', async () => {
    const existsSyncSpy = vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    await handleFlowGeneration({interactive: true})(INITIATED_RC_JSON);
    expect(existsSyncSpy).toHaveBeenCalled();
    expect(prompt).toHaveBeenCalled();
  });

  it('should not prompt if interactive is true and if file already exists',async () => {
    const existsSyncSpy = vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    const isDirectorySpy = vi.spyOn(fs, 'lstatSync').mockReturnValue({ isDirectory: () => false } as fs.Stats);
    const readFileSyncSpy = vi.spyOn(fs, 'readFileSync').mockReturnValue('Dummy Flow');
    await handleFlowGeneration({interactive: true})(INITIATED_RC_JSON);
    expect(existsSyncSpy).toHaveBeenCalled();
    expect(isDirectorySpy).toHaveBeenCalled();
    expect(readFileSyncSpy).toHaveBeenCalled();
    expect(prompt).not.toHaveBeenCalled();
  });

  it('should not prompt if interactive is false',async () => {
    await handleFlowGeneration({interactive: false})(INITIATED_RC_JSON);
    expect(prompt).not.toHaveBeenCalled();
  });

  it('should not check if file exist if interactive is false', async () => {
    const existsSyncSpy = vi.spyOn(fs, 'existsSync');
    await handleFlowGeneration({interactive: false})(INITIATED_RC_JSON);
    expect(existsSyncSpy).not.toHaveBeenCalled();
  });

  it('should create flow if generateFlow is true', async () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue([]);
    vi.spyOn(fs, 'existsSync').mockReturnValueOnce(false).mockReturnValue(true);
    vi.spyOn(fs, 'lstatSync').mockReturnValue({ isDirectory: () => false } as fs.Stats);
    vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(Buffer.from(''));
    const writeFileSyncSpy = vi.spyOn(fs, 'writeFileSync');
    await handleFlowGeneration({interactive: true, generateFlow: true})(INITIATED_RC_JSON);
    expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
  });

  it('should not create flow if generateFlow is false', async () => {
    const writeFileSyncSpy = vi.spyOn(fs, 'writeFileSync');
    await handleFlowGeneration({interactive: true, generateFlow: false})(INITIATED_RC_JSON);
    expect(writeFileSyncSpy).not.toHaveBeenCalled();
  });
});
