import { argv } from 'yargs';
import { Param } from './config.model';
import { LhConfigJson } from '../../../hacky-things/lighthouse';

export const param: Param = {
  config: {
    alias: 'l',
    type: 'object',
    description: 'Lighthouse configuration (RC file only)',
  },
};

export function get(): string[] {
  const { config } = argv as any as { config: LhConfigJson };
  return config as string[];
}
