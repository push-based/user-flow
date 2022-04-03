import { argv } from 'yargs';
import { Param } from './staticDistDir.model';
import { ArgvT } from '../../../internal/yargs/model';

// inspired by: https://github.com/GoogleChrome/lighthouse-ci/blob/main/packages/cli/src/collect/collect.js#L28-L98
export const param: Param = {
  staticDistDir: {
    alias: 'd',
    type: 'string',
    description: 'The build directory where your HTML files to run Lighthouse on are located.',
    // demandOption: true
  }
};

export function get(): string {
  const { staticDistDir } = argv as any as ArgvT<Param>;
  return staticDistDir;
}
