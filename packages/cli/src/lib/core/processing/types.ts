import { RcJson } from '../../types.js';

export type CLIProcess = (cfg: RcJson) => Promise<RcJson> | RcJson;

export type TapProcess = (cfg: RcJson) => any | Promise<any>;

export type Condition = ((r: RcJson) => boolean) | ((r: RcJson) => Promise<boolean>);
