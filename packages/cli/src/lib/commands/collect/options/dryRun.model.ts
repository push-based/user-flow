import { Options } from 'yargs';
import { Modify } from '../../../core/types';

export type Param = {
  dryRun: Modify<Options, {
    type: 'boolean';
    default: boolean;
  }>
};
