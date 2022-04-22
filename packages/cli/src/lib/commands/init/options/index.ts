import { AssertOptions } from '../../assert/options/types';
import { ASSERT_OPTIONS } from '../../assert/options';
import { COLLECT_OPTIONS } from '../../collect/options';
import { CollectYargsOptions } from '../../collect/options/types';

export const INIT_OPTIONS: CollectYargsOptions & AssertOptions = {
  ...COLLECT_OPTIONS,
  ...ASSERT_OPTIONS
};
