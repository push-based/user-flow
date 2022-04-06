import { PersistOptions, CollectOptions  } from '../../internal/config/model';

export type CollectCommandOptions = CollectOptions & PersistOptions & { openReport: boolean };
