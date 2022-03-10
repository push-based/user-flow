import { Options } from 'yargs';
import { Modify } from '../../../internal/utils/types';

export type Param = {
  open: Modify<Options, {
    type: 'boolean';
  }>
};
