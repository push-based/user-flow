import { CollectOptions } from './types';
import { AssertOptions } from '../../assert/options/types';
import { ASSERT_OPTIONS } from '../../assert/options';
import { COLLECT_OPTIONS } from '../../collect/options';

export const INIT_OPTIONS: CollectOptions & AssertOptions = {
  ...COLLECT_OPTIONS,
  ...ASSERT_OPTIONS
};
