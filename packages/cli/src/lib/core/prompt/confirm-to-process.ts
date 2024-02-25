import { promptParam } from './prompt';
import { CLIProcess } from '../processing/types';
import { RcJson } from '../../types';

type Precondition = (context: RcJson) => Promise<boolean> | boolean;

type ConfirmProcess = {
  prompt: string,
  process: CLIProcess,
  denied?: CLIProcess
  precondition?: Precondition,
}

const confirmedPrompt = async (prompt: string): Promise<boolean> => {
  return await promptParam({
    type: 'confirm',
    message: prompt,
    initial: true,
  });
}


const isPreconditionMet = async (context: RcJson, precondition?: Precondition): Promise<boolean> => {
  return precondition === undefined ? true : precondition(context);
}

export function confirmToProcess({ prompt, process, precondition }: ConfirmProcess): CLIProcess {
  return async (context: RcJson): Promise<RcJson> => {

    const shouldPrompt = await isPreconditionMet(context, precondition);
    if (!shouldPrompt) {
      return context;
    }

    const shouldProcess = await confirmedPrompt(prompt);
    if (!shouldProcess) {
      return context;
    }

    return process(context);
  }
}
