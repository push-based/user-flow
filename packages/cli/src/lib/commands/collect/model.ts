import { PersistOptions, CollectOptions, AssertOptions } from '../../internal/config/model';

export type CollectCommandOptions = CollectOptions & PersistOptions & AssertOptions & { openReport: boolean };
