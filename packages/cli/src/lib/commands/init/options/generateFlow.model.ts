import { Options } from 'yargs';
import { Modify } from '../../../core/types';

export type Param = {
  generateFlow: Modify<Options, {
    type: 'boolean';
    default?: boolean;
  }>
};
