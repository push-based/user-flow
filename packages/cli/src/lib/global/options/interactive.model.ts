import { Options } from 'yargs';
import { Modify } from '../../core/types.js';

export type Param = {
  interactive: Modify<Options, {
    alias: 'i',
    type: 'boolean';
  }>
};
