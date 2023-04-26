import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const yargs = _yargs(hideBin(process.argv));
import { Param } from './configPath.model.js';
import { ArgvOption } from '../../../core/yargs/types.js';

export const param: Param = {
  configPath: {
    alias: 'c',
    type: 'string',
    description: 'Path to Lighthouse configuration e.g config.json'
  }
};

export function get(): string {
  const { configPath } = yargs.argv as any as ArgvOption<Param>;
  return configPath as string;
}
