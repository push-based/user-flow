import { Options } from 'yargs';
import { Modify } from '../../../internal/utils/types';

export type Param = {
  url: Modify<Options, {
    type: 'string';
  }>
};
