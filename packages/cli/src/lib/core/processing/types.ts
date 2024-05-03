import { RcJson } from '../../types.js';

export interface CLIProcess {
  (cfg: RcJson): Promise<RcJson>;
}

export interface Process {
  (_?: any): Promise<any>;
}
