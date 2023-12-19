import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Param } from './config.model.js';
import { LhConfigJson } from '../../../hacky-things/lighthouse.js';

const yargs = _yargs(hideBin(process.argv));

export const param: Param = {
  config: {
    alias: 'l',
    type: 'object',
    description: 'Lighthouse configuration (RC file only)'
  }
};

export function get(): string[] {
  const { config } = yargs.argv as any as { config: LhConfigJson };
  return config as string[];
}
