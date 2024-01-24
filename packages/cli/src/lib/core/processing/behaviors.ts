import { CLIProcess, Condition, TapProcess } from './types.js';
import { RcJson } from '../../types.js';

export function run(tasks: CLIProcess[]): CLIProcess {
  return (config) => concat(tasks)(config);
}

export function concat(processes: CLIProcess[]): CLIProcess {
  return async function(r: RcJson): Promise<RcJson> {
    return await processes.reduce(
      async (cfg, processor) => await processor(await cfg),
      Promise.resolve(r)
    );
  };
}

export function ifThenElse(condition: Condition, thenProcess: CLIProcess, elseProcess?: CLIProcess): CLIProcess {
  return async function(r: RcJson): Promise<RcJson> {
    if (await condition(r)) {
      return thenProcess(r);
    } else if (elseProcess) {
      return elseProcess(r);
    }
    return Promise.resolve(r);
  };
}

export function tap(process: TapProcess): CLIProcess {
  return async function(d: RcJson): Promise<RcJson> {
    await process(d);
    return Promise.resolve(d);
  };
}
