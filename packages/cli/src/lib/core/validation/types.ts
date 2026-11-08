/* oxlint-disable typescript/no-explicit-any -- validators are written for concrete value types and return ad-hoc error shapes */
export type Error = any;
export type ValidatorFn = (value: any, ctx?: any) => Error | null;
export type ValidatorFnFactory = (cfg: any) => (value: any, ctx?: any) => Error | null;
