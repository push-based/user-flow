export type Error = any;
export type ValidatorFn = (value: any, ctx?: any) => Error | null;
export type ValidatorFnFactory = (cfg: any) => (value: any, ctx?: any) => Error | null;
