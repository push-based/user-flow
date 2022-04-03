import { argv } from 'yargs';
import { Param } from './isSinglePageApplication.model';
import { ArgvT } from '../../../internal/yargs/model';

// inspired by: https://github.com/GoogleChrome/lighthouse-ci/blob/main/packages/cli/src/collect/collect.js#L28-L98
export const param: Param = {
  isSinglePageApplication: {
    alias: 'a',
    type: 'string',
    description: 'If the application is created by Single Page Application, enable redirect to index.html.',
    // demandOption: true
  }
};

export function get(): string {
  const { isSinglePageApplication } = argv as any as ArgvT<Param>;
  return isSinglePageApplication;
}
