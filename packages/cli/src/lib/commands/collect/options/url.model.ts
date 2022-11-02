import { Options } from 'yargs';
import { Modify } from '../../../core/types';

export type Param = {
  url: Modify<Options, {
    type: 'string';
  }>
};
