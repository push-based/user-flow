import { argv } from 'yargs';
import { Param } from './interactive.model';
import { ArgvOption } from '../../core/yargs/types';
import { join } from "path";
import { DEFAULT_RC_NAME, DEFAULT_RC_PATH } from './rc.constant';

export const param: Param = {
  interactive: {
    alias: 'i',
    type: 'boolean',
    description: 'When false questions are skipped with the values from the suggestions. This is useful for CI integrations.',
    default: true
  }
};

// We don't rely on yargs option normalization features as this can happen before cli bootstrap
export function get(): boolean {
    const {interactive, i } = argv as any as ArgvOption<any>;
    return interactive !== undefined ?  Boolean(interactive) : i !== undefined ? Boolean(i) : param.interactive.default;
}
