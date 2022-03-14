export type UserFlowRcConfig = {
  collect: {
    url: string,
    ufPath: string,
  },
  persist: {
    outPath: string
  }
} & Object;
