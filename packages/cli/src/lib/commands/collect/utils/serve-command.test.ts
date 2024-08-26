import { describe, vi, expect, it, beforeEach } from 'vitest';
import { startServerIfNeededAndExecute } from './serve-command.js';
import { concurrently } from 'concurrently';

import { CollectRcOptions } from '../options/types.js';

vi.mock('../../../core/loggin');
vi.mock('concurrently', async () => {
  const C = await vi.importActual<{concurrently: typeof concurrently}>('concurrently');
  return {concurrently: vi.fn().mockImplementation(C.concurrently)};
});
const userFlowWorkMock = vi.fn().mockResolvedValue({});

describe('startServerIfNeeded', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw if serveCommand is provided but no await string', async () => {
    const fn = async () => await startServerIfNeededAndExecute(userFlowWorkMock, { serveCommand: 'npm run start' } as CollectRcOptions);
    expect(fn).rejects.toThrowError('If a serve command is provided awaitServeStdout is also required');
    expect(userFlowWorkMock).not.toHaveBeenCalled();
  });

  it('should immediately execute work if no serveCommand is provided', async () => {
    await startServerIfNeededAndExecute(userFlowWorkMock);
    expect(userFlowWorkMock).toHaveBeenCalled();
  });

  it('should execute serveCommand first if it is provided correctly', async () => {
    const concurrentlySpy = vi.mocked(concurrently);
    await startServerIfNeededAndExecute(userFlowWorkMock, { serveCommand: 'node --help', awaitServeStdout: 'v' } as CollectRcOptions);
    expect(concurrentlySpy.mock.invocationCallOrder < userFlowWorkMock.mock.invocationCallOrder).toBeTruthy();
  });

  it('should exit with error if serveCommand throws', async () => {
    const fn = async () => await startServerIfNeededAndExecute(userFlowWorkMock, { serveCommand: 'Broken Command!', awaitServeStdout: 'v' } as CollectRcOptions);
    expect(fn).rejects.toThrowError(expect.stringContaining('Broken Command!'));
  });

  it('should run serveCommand', async () => {
    const concurrentlySpy = vi.mocked(concurrently);
    await startServerIfNeededAndExecute(userFlowWorkMock, { serveCommand: 'node --help', awaitServeStdout: 'Usage: node' } as CollectRcOptions);
    expect(concurrentlySpy).toHaveBeenCalled();
  });

  it('should run serveCommand and catch error in user-flows', async () => {
    userFlowWorkMock.mockRejectedValue('user flow error');
    const fn = async () => await startServerIfNeededAndExecute(userFlowWorkMock, { serveCommand: 'node --help', awaitServeStdout: 'Usage: node' } as CollectRcOptions);
    expect(fn).rejects.toThrowError(expect.stringContaining(`user flow error`));
  });
});
