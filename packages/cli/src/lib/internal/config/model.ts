export type CollectOptions = {
  url: string,
  ufPath: string,
  // @TODO get better typing for if serveCommand is given await is required
  serveCommand?: string,
  awaitServeStdout?: string
}

export type PersistOptions = {
  outPath: string
}


export type UserFlowRcConfig = {
  collect: CollectOptions,
  persist: PersistOptions
} & Object;
