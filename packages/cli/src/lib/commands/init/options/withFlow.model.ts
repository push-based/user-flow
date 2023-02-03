import { Options } from 'yargs';
import { Modify } from '../../../core/types';

export type Param = {
  withFlow: Modify<Options, {
    type: 'boolean';
    default: boolean;
  }>
};
