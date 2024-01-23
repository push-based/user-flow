import { ArgumentsCamelCase, Argv, CommandModule } from 'yargs';

import { logVerbose } from '../../core/loggin/index.js';
import { GlobalCliOptions } from '../../global/options/index.js';
import { assertOptions, AssertOptions } from './options.js';

type AssertCommandOptions = GlobalCliOptions & AssertOptions;
// TODO Create Assert command!
async function runAssert(argv: ArgumentsCamelCase<AssertCommandOptions>): Promise<void> {
  logVerbose(`run "assert" as a yargs command`);
  console.log('Assert Options: ', argv);
  return Promise.resolve();
}

export const assertCommand: CommandModule<GlobalCliOptions, AssertCommandOptions> = {
  command: 'assert',
  describe: 'Assertion Command',
  builder: (argv: Argv<GlobalCliOptions>) => argv.options(assertOptions),
  handler: runAssert
}
