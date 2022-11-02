import { Options } from 'yargs';
import { Modify } from '../utils/types';

export type Param = {
  interactive: Modify<Options, {
    alias: 'i';
    type: 'boolean';
  }>
};
