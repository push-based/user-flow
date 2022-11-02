import { Options } from 'yargs';
import { Modify } from '../../core/types';

export type Param = {
  verbose: Modify<Options, {
    alias: 'v';
    type: 'boolean';
  }>
};
