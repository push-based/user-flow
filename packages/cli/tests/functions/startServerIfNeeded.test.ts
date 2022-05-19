import { startServerIfNeededAndExecute } from '../../src/lib/commands/collect/utils/serve-command';

import spyOn = jest.spyOn;
import { CollectOptions } from '../../src/lib/core/rc-json/types';

describe('startServerIfNeeded', () => {

  it('should throw if serveCommand is provided but no await string', async () => {
    const o = {
      serveCommand: 'npm run start'
    } as CollectOptions;
    const userFlowWork = () => Promise.resolve(void 0);
    const spy = spyOn({ userFlowWork }, 'userFlowWork');

    let err: string | undefined = undefined;
    const res = await startServerIfNeededAndExecute(userFlowWork, o).catch((e: Error) => {
      err = e.message;
      return undefined;
    });

    expect(res).toBe(undefined);
    expect(err).toContain('If a serve command is provided awaitServeStdout is also required');
    expect(spy).not.toHaveBeenCalled();

  });

  it('should immediately execute work if no serveCommand is provided', async () => {
    let flowRes: number = 0;
    const userFlowWork = () => {
      ++flowRes;
      return Promise.resolve(flowRes);
    };


    let res = await startServerIfNeededAndExecute(userFlowWork).catch((e: Error) => {
      return undefined;
    });

    expect(flowRes).toBe(1);
  });

  it('should execute serveCommand first if it is provided correctly', async () => {
    const o = {
      serveCommand: 'node --help'
    } as CollectOptions;
    let err: string | undefined = undefined;

    let flowRes: number = 0;
    const userFlowWork = () => {
      ++flowRes;
      return Promise.resolve(flowRes);
    };

    let res = await startServerIfNeededAndExecute(userFlowWork, o).catch((e: Error) => {
      err = e.message;
      return undefined;
    });

    // sync code unchanged
    expect(flowRes).toBe(0);
    // after command changes present
    setTimeout(() => {
      expect(flowRes).toBe(1);
    }, 1000);


  });

  it('should exit with error if serveCommand throws', async () => {
    const o = {
      serveCommand: 'node brokenServeCommand',
      awaitServeStdout: 'v'
    } as CollectOptions;
    let err: string | undefined = undefined;
    const userFlowWork = () => Promise.resolve(void 0);

    let res = await startServerIfNeededAndExecute(userFlowWork, o).catch((e: Error) => {
      err = e as any;
      return undefined;
    });

    expect(err).toContain(`Error while executing ${o.serveCommand}`);
    expect(res).toBe(undefined);

  });

  it('should run serveCommand', async () => {
    const o = {
      serveCommand: 'node --help',
      awaitServeStdout: 'Usage: node'
    } as CollectOptions;
    let err: string | undefined = undefined;
    const userFlowWork = () => Promise.resolve('user flow result');

    let res = await startServerIfNeededAndExecute(userFlowWork, o).catch((e: Error) => {
      err = e as any;
      return undefined;
    });

    expect(res).toContain(`user flow result`);
    expect(err).toBe(undefined);

  });

  it('should run serveCommand and catch error in user-flows', async () => {
    const o = {
      serveCommand: 'node --help',
      awaitServeStdout: 'Usage: node'
    } as CollectOptions;
    let err: string | undefined = undefined;
    const userFlowWork = () => Promise.reject('user flow error');

    let res = await startServerIfNeededAndExecute(userFlowWork, o).catch((e: Error) => {
      err = e as any;
      return undefined;
    });

    expect(err).toContain(`user flow error`);
    expect(res).toBe(undefined);

  });

});
