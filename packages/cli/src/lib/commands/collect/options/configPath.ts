import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Param } from './configPath.model.js';
import { ArgvOption } from '../../../core/yargs/types.js';

const yargs = _yargs(hideBin(process.argv));

export const param: Param = {
  configPath: {
    alias: 'c',
    type: 'string',
    description: 'Path to Lighthouse configuration e.g config.json'
  }
};

export function get(): string {
  const { configPath } = yargs.argv as any as ArgvOption<Param>;
  return configPath;
}
