import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { GLOBAL_OPTIONS_YARGS_CFG } from '../../global/options/index.js';
import { initCommand } from '../../commands/init/index.js';
import { collectCommand } from '../../commands/collect/index.js';
import { assertCommand } from '../../commands/assert/index.js';

export function setupYargs() {
  return yargs(hideBin(process.argv))
    .options(GLOBAL_OPTIONS_YARGS_CFG)
    .command(initCommand)
    .command(collectCommand)
    .command(assertCommand)
    .parserConfiguration({ 'boolean-negation': true })
    .recommendCommands()
    .example([['init', 'Setup user-flows over prompts']])
    .help()
    .alias('h', 'help');
}

export async function runCli() {
  return setupYargs().argv;
}

