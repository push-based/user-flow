import { Options } from 'yargs';
import { Modify } from '../../../core/types.js';

export type Param = {
  generateGhWorkflow: Modify<Options, {
    type: 'boolean';
    default?: boolean;
  }>
};
