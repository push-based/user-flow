import { Options } from 'yargs';
import { Modify } from '../../../core/types.js';

export type Param = {
  url: Modify<Options, {
    type: 'string';
  }>
};
