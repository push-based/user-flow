import { Options } from 'yargs';
import { Modify } from '../../../internal/utils/types';

export type Param = {
  format: Modify<Options, {
    type: 'array';
  }>
};
