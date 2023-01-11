import { Options } from 'yargs';
import { Modify } from '../../../core/types';

export type Param = {
  rcPath: Modify<Options, {
    alias: 'p';
    type: 'string';
  }>
};
