import { Options } from 'yargs';
import { Modify } from '../../../core/types.js';

export type Param = {
  openReport: Modify<Options, {
    type: 'boolean';
  }>
};
