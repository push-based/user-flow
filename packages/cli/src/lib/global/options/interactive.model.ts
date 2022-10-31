import { Options } from 'yargs';
import { Modify } from '../../core/types';

export type Param = {
  interactive: Modify<Options, {
    type: 'boolean';
  }>
};
