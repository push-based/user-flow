import { loadFlow } from './load-flow';
import * as fileHelpers from '../../../../core/file';
import * as fs from 'node:fs';

jest.mock('node:fs');
jest.mock('../../../../core/file');

describe('loading user-flow scripts for execution', () => {

  beforeEach(() => {
    jest.resetAllMocks();
  })

  it('should throw if ufPath does not exist', () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const loadFlowFn = () => loadFlow({ ufPath: './path' });
    expect(loadFlowFn).toThrow();
    expect(existsSyncSpy).toHaveBeenCalled();
  });

  it('should throw if ufPath points to a file and it does not end in with ts or js', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'lstatSync').mockReturnValue({ isDirectory: () => false } as fs.Stats);
    const resolveAnyFileSpy = jest.spyOn(fileHelpers, 'resolveAnyFile');
    const loadFlowFn = () => loadFlow({ ufPath: './path' });
    expect(loadFlowFn).toThrow();
    expect(resolveAnyFileSpy).not.toHaveBeenCalled();
  });

  it('should throw if ufPath points to a directory and it does not contain any files that end with ts or js', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'lstatSync').mockReturnValue({ isDirectory: () => true } as fs.Stats);
    jest.spyOn(fs, 'readdirSync').mockReturnValue(['file.json' as unknown as fs.Dirent])
    const resolveAnyFileSpy = jest.spyOn(fileHelpers, 'resolveAnyFile');
    const loadFlowFn = () => loadFlow({ ufPath: './path' });
    expect(loadFlowFn).toThrow();
    expect(resolveAnyFileSpy).not.toHaveBeenCalled();
  });

  it('should extract all file paths in the directory if ufPath points to a directory', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fileHelpers, 'resolveAnyFile').mockReturnValue('Flow Dummy' as any);
    const isDirectorySpy = jest.spyOn(fs, 'lstatSync').mockReturnValue({ isDirectory: () => true } as fs.Stats);
    const readdirSyncSpy = jest.spyOn(fs, 'readdirSync').mockReturnValue(['file.ts' as unknown as fs.Dirent])
    loadFlow({ ufPath: './path' });
    expect(isDirectorySpy).toHaveBeenCalled();
    expect(readdirSyncSpy).toHaveBeenCalled();
  });

  it('should only resolve files ending in ts or js', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'lstatSync').mockReturnValue({ isDirectory: () => true } as fs.Stats);
    jest.spyOn(fs, 'readdirSync')
      .mockReturnValue(['file.ts', 'file.js', 'file.tsx', 'file.json', 'file.js.json'] as unknown as fs.Dirent[]);
    const resolveAnyFileSpy = jest.spyOn(fileHelpers, 'resolveAnyFile');
    loadFlow({ ufPath: './path' });
    expect(resolveAnyFileSpy).toHaveBeenCalledTimes(2);
  })
});

