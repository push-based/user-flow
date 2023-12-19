import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Param } from './serveCommand.model.js';
import { ArgvOption } from '../../../core/yargs/types.js';

const yargs = _yargs(hideBin(process.argv));

// inspired by: https://github.com/GoogleChrome/lighthouse-ci/blob/main/packages/cli/src/collect/collect.js#L28-L98
export const param: Param = {
  serveCommand: {
    alias: 's',
    type: 'string',
    description: 'The npm command to serve your application. e.g. "npm run serve:prod"',
    // demandOption: true
  }
};

export function get(): string {
  const { serveCommand } = yargs.argv as any as ArgvOption<Param>;
  return serveCommand;
}
