import { Options } from 'yargs';
import { Modify } from '../utils/types';

export type Param = {
  dryRun: Modify<Options, {
    type: 'boolean';
    default: false;
  }>
};
