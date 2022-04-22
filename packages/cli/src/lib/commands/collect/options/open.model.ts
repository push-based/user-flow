import { Options } from 'yargs';
import { Modify } from '../../../core/utils/types';

export type Param = {
  open: Modify<Options, {
    type: 'boolean';
  }>
};
