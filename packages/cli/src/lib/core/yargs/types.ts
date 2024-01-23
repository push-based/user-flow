import { Options } from 'yargs';

export type ArgvOption<T extends { [key: string]: Options }> = {[K in keyof T]: YargsOptionTypeToTsType<T[K]['type']>};
export type YargsOptionTypeToTsType<T> = T extends 'array' ? Array<unknown> :
  T extends 'count' | 'number' ? number :
    T extends 'string' ? string :
      T extends 'boolean' ? boolean :
        T extends undefined ? undefined : never;
export type YargsArgvOptionFromParamsOptions<T extends { [opt: string]: Options }> = { [key in keyof T]: YargsOptionTypeToTsType<T[key]['type']> }
