import { Options } from 'yargs';
import { Modify } from '../../internal/utils/types';

export type Param = {
  rcPath: Modify<Options, {
    alias: 'p';
    type: 'string';
  }>
};
