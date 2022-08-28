import * as _cliPromptTest from 'cli-prompts-test';
import { CLI_MODE_PROPERTY } from '../../packages/cli/src/lib/cli-modes';

export const cliPromptTest = (arr1: any[], arr2: any[], obj1: Object):
  { exitCode: string, stdout: string, stderr: string } => {
  (process.env as any)[CLI_MODE_PROPERTY] = 'SANDBOX';
  return _cliPromptTest(arr1, arr2, obj1);
};

