import { RcJson } from '../../../types';
import { CLIProcess, Process } from './types';

export function run(
  tasks: CLIProcess[]
): CLIProcess {
  return (config) => concat(tasks)(config);
}


export function concat(processes: Process[]): Process {
  return async function(r: any): Promise<any> {
    return await processes.reduce(
      async (cfg, processor) => await processor(await cfg),
      Promise.resolve(r)
    );
  };
}


export function ifThenElse(condition: (r: RcJson) => boolean, thenProcess: CLIProcess, elseProcess?: CLIProcess): CLIProcess {
  return async function(r: RcJson): Promise<RcJson> {
    const conditionResult = await condition(r);
    if (conditionResult) {
      return thenProcess(r);
    } else {
      return elseProcess ? elseProcess(r) : Promise.resolve(r);
    }
  };
}

export function tap(process: CLIProcess): CLIProcess {
  return async function(d: RcJson): Promise<RcJson> {
    await process(d);
    return Promise.resolve(d);
  };
}
