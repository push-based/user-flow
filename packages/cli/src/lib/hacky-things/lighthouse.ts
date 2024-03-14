/*
* NOTICE:
*
* As long as we did bot solve the import problem we will isolate this hack here to not pollute our codebase with `@ts-ignore`.
*
* */

// @ts-ignore
import { default as LhConfig } from 'lighthouse/types/config.d';
export type LhConfigJson = LhConfig.Json;
export { default as UserFlow } from 'lighthouse/types/user-flow.d';
