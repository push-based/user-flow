import { Argv, CommandModule, Options } from 'yargs';

export interface YargsCommandObject {
  command: string | ReadonlyArray<string>;
  description: string;
  builder?: (y: Argv) => any;
  module: CommandModule;
}

type ArgvTypeToTs<T extends Options['type']> =  T extends 'array' ? Array<unknown> :
  T extends 'count' ? number :
    T extends 'boolean' ? boolean :
      T extends 'number' ? number :
        T extends 'string' ? string :
          T extends undefined ? undefined : never;

export type ArgvT<T extends { [key: string]: Options }> = {[K in keyof T]: ArgvTypeToTs<T[K]['type']>};
