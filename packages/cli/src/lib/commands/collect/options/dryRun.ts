import _yargs, { Options } from 'yargs';
import { hideBin } from 'yargs/helpers';

const yargs = _yargs(hideBin(process.argv));

export const dryRun = {
  alias: 'd',
  type: 'boolean',
  description: 'Execute commands without effects',
  default: false
} as const satisfies Options;

// @TODO this needs to be completely removed!
export function get(): boolean {
  const { dryRun } = yargs.argv as any as { dryRun: boolean };
  return dryRun;
}
