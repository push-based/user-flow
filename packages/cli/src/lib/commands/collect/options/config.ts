import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const yargs = _yargs(hideBin(process.argv));
import { Param } from './configPath.model.js';



export const param: Param = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  config: {
    alias: 'l',
    type: 'object',
    description: 'Lighthouse configuration (RC file only)'
  }
};

export function get(): string[] {
  const { config } = yargs.argv as any as { config: any };
  return config as string[];
}
