import { InferredOptionTypes } from 'yargs';

import { AssertYargsOptions } from '../../assert/options/types.js';
import { ASSERT_OPTIONS } from '../../assert/options/index.js';
import { COLLECT_OPTIONS } from '../../collect/options/index.js';
import { CollectYargsOptions } from '../../collect/options/types.js';

export const INIT_OPTIONS: CollectYargsOptions & AssertYargsOptions = {
  ...COLLECT_OPTIONS,
  ...ASSERT_OPTIONS
};
export type InitOptions = InferredOptionTypes<typeof INIT_OPTIONS>;
