import { Options } from 'yargs';
import { Modify } from '../../../core/utils/types';

export type Param = {
  ufPath: Modify<Options, {
    type: 'string';
  }>
};
