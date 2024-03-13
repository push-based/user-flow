import { describe, expect, it, beforeEach, vi } from 'vitest';
import { loadFlow } from './load-flow';
import * as fileHelpers from '../../../../core/file';
import * as fs from 'node:fs';

vi.mock('node:fs');
vi.mock('../../../../core/file');

describe('loading user-flow scripts for execution', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('should throw if ufPath does not exist', () => {
    const existsSyncSpy = vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    expect(() => loadFlow({ ufPath: './path' })).toThrow();
    expect(existsSyncSpy).toHaveBeenCalled();
  });

  it('should throw if ufPath points to a file and it does not end in with ts or js', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'lstatSync').mockReturnValue({ isDirectory: () => false } as fs.Stats);
    const resolveAnyFileSpy = vi.spyOn(fileHelpers, 'resolveAnyFile');
    expect(() => loadFlow({ ufPath: './path/file.json' })).toThrow();
    expect(resolveAnyFileSpy).not.toHaveBeenCalled();
  });

  it('should throw if ufPath points to a directory and it does not contain any files that end with ts or js', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'lstatSync').mockReturnValue({ isDirectory: () => true } as fs.Stats);
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['file.json' as unknown as fs.Dirent])
    const resolveAnyFileSpy = vi.spyOn(fileHelpers, 'resolveAnyFile');
    expect(() => loadFlow({ ufPath: './path' })).toThrow();
    expect(resolveAnyFileSpy).not.toHaveBeenCalled();
  });

  it('should extract all file paths in the directory if ufPath points to a directory', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fileHelpers, 'resolveAnyFile').mockReturnValue('Flow Dummy' as any);
    const isDirectorySpy = vi.spyOn(fs, 'lstatSync').mockReturnValue({ isDirectory: () => true } as fs.Stats);
    const readdirSyncSpy = vi.spyOn(fs, 'readdirSync').mockReturnValue(['file.ts' as unknown as fs.Dirent])
    loadFlow({ ufPath: './user-flow-dir-path' });
    expect(isDirectorySpy).toHaveBeenCalled();
    expect(readdirSyncSpy).toHaveBeenCalledWith(expect.stringContaining('user-flow-dir-path'));
  });

  it('should only resolve files ending in ts or js', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'lstatSync').mockReturnValue({ isDirectory: () => true } as fs.Stats);
    vi.spyOn(fs, 'readdirSync')
      .mockReturnValue(['file.ts', 'file.js', 'file.tsx', 'file.json', 'file.js.json'] as unknown as fs.Dirent[]);
    const resolveAnyFileSpy = vi.spyOn(fileHelpers, 'resolveAnyFile');
    loadFlow({ ufPath: './path' });
    expect(resolveAnyFileSpy).toHaveBeenCalledTimes(2);
    expect(resolveAnyFileSpy).toHaveBeenNthCalledWith(1, expect.stringContaining('file.ts'));
    expect(resolveAnyFileSpy).toHaveBeenNthCalledWith(2, expect.stringContaining('file.js'));
  });
});

