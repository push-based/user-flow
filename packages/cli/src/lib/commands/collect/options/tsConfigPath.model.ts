import { Options } from 'yargs';
import { Modify } from '../../../core/types';

export type Param = {
  tsConfigPath: Modify<Options, {
    type: 'string';
  }>
};
