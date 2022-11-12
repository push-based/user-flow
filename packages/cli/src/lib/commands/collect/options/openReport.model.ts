import { Options } from 'yargs';
import { Modify } from '../../../core/types';

export type Param = {
  openReport: Modify<Options, {
    type: 'boolean';
  }>
};
