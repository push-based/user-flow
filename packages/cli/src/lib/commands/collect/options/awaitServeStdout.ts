import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Param } from './awaitServeStdout.model.js';
import { ArgvOption } from '../../../core/yargs/types.js';

const yargs = _yargs(hideBin(process.argv));

// inspired by: https://github.com/GoogleChrome/lighthouse-ci/blob/main/packages/cli/src/collect/collect.js#L28-L98
export const param: Param = {
  awaitServeStdout: {
    alias: 'w',
    type: 'string',
    description: 'A string in stdou resulting from serving the app, to be awaited before start running the tests. e.g. "server running..."',
    implies: ['w', 'serveCommand']
  }
};

export function get(): string {
  const { awaitServeStdout } = yargs.argv as any as ArgvOption<Param>;
  return awaitServeStdout;
}
