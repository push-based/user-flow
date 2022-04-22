import { Options } from 'yargs';
import { Modify } from '../../../core/utils/types';

export type Param = {
  url: Modify<Options, {
    type: 'string';
  }>
};
