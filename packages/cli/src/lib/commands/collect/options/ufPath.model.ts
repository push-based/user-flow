import { Options } from 'yargs';
import { Modify } from '../../../internal/utils/types';

export type Param = {
  ufPath: Modify<Options, {
    type: 'string';
  }>
};
