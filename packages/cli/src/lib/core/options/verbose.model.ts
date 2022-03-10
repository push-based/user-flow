import { Options } from 'yargs';
import { Modify } from '../../internal/utils/types';

export type Param = {
  verbose: Modify<Options, {
    alias: 'v';
    type: 'boolean';
  }>
};
