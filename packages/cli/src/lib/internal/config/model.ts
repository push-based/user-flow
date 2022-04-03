import { BuildServer } from '../../commands/collect/build-server';

export type UserFlowRcConfig = {
  collect: {
    url: string,
    ufPath: string,
    startServerCommand?: string,
    staticDistDir: string,
    isSinglePageApplication: boolean
  },
  persist: {
    outPath: string
  }
} & Object;
