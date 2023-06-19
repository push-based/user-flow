import { prompt } from 'enquirer';
import { CLIProcess } from './processing/types';
import { RcJson } from '../types';

export async function promptParam<T>(cfg: {
  initial?: T;
  skip?: boolean;
  message: string;
  type?: any;
  [key: string]: any;
}): Promise<T> {
  let {type, initial, message, skip, choices, result} = cfg;
  type = type || 'input';

  const {param} = await prompt<{ param: T }>([
    {
      name: 'param',
      type,
      initial,
      message,
      skip,
      result,
    },
  ]);

  return param;
}

async function shouldProceed(question: string): Promise<boolean> {
  const proceed: boolean = await promptParam({
    type: 'confirm',
    message: question,
    initial: true,
  });

  return proceed;
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
    const isPreconditionMet = await (options?.precondition
      ? options?.precondition(d)
      : Promise.resolve(false));

    if (!isPreconditionMet) {
      return d;
    }

    if (await shouldProceed(question)) {
      return await cliProcess(d);
    }

    return d;
  };
}
