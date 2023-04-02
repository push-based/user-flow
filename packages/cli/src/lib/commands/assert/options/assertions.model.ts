import { Options } from 'yargs';
import { Modify } from '../../../core/types';

export type Param = {
  assertions: Modify<Options, {
    type: 'array';
  }>
};
