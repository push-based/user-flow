import pkg from 'enquirer';

import { CLIProcess } from './processing/types.js';
import { RcJson } from '../types.js';

const { prompt } = pkg;

export async function promptParam<T>(cfg: {initial?: T, skip?: boolean, message: string, type?: any, [key: string]: any}): Promise<T> {
  let {type, initial,  message,skip, result   } = cfg;
  type = type || 'input';

  const { param } = await prompt<{ param: T }>([
    {
      name: 'param',
      type,
      initial, message, skip, result
    }
  ]);

  return param;
}

async function shouldProceed(question: string): Promise<boolean> {

  return await promptParam(
    {
      type: 'confirm',
      message: question,
      initial: true,
    }
  );
}

export function askToSkip(
  question: string,
  cliProcess: CLIProcess,
  options: {
    precondition?: (r?: RcJson) => Promise<boolean>;
  } = {
    precondition: async () => true,
  }
): CLIProcess {
  return async function (d: RcJson): Promise<RcJson> {
    const isPreconditionMet = await (options?.precondition ? options?.precondition(d) : Promise.resolve(false));

    if (!isPreconditionMet) {
      return d;
    }

    if (await shouldProceed(question)) {
      return await cliProcess(d);
    }

    return d;
  };
}

