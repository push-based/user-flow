import { argv } from 'yargs';
import { Param } from './awaitServeStdout.model';
import { ArgvT } from '../../../internal/utils/yargs/types';

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
  const { awaitServeStdout } = argv as any as ArgvT<Param>;
  return awaitServeStdout;
}
