import { RcJson } from '../../global/rc-json/types';

export interface CLIProcess {
  (cfg: RcJson): Promise<RcJson>;
}

export interface Process {
  (_?: any): Promise<any>;
}
