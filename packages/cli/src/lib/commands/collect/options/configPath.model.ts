import { Options } from 'yargs';
import { Modify } from '../../../core/utils/types';

export type Param = {
  configPath: Modify<Options, {
    type: 'string';
  }>
};
