import { Options } from 'yargs';
import { Modify } from '../../internal/utils/types';

export type Param = {
  dryRun: Modify<Options, {
    type: 'boolean';
    default: false;
  }>
};
