import { Options } from 'yargs';
import { Modify } from '../../../core/types';

export type Param = {
  open: Modify<Options, {
    type: 'boolean';
  }>
};
