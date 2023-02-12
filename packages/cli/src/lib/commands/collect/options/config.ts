import { argv } from 'yargs';
import { Param } from './config.model';
import LhConfig from 'lighthouse/types/config';

export const param: Param = {
  config: {
    alias: 'l',
    type: 'object',
    description: 'Lighthouse configuration (RC file only)'
  }
};

export function get(): string[] {
  const { config } = argv as any as { config: LhConfig };
  return config as string[];
}
