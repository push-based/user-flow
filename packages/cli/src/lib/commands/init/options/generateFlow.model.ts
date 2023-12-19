import { Options } from 'yargs';
import { Modify } from '../../../core/types.js';

export type Param = {
  generateFlow: Modify<Options, {
    type: 'boolean';
    default?: boolean;
  }>
};
