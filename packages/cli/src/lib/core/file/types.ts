import { ReadFileConfig } from '../../commands/collect/utils/replay/types.js';

type GetDefinedType<
  T extends {} | undefined,
  K extends keyof T | undefined
  > = T extends undefined ? never :
  K extends undefined ? never
    : K extends keyof T ? T[K] : never;
/*
//type undef = GetDefinedType; // never
//type r = GetDefinedType; // never
//type t = GetDefinedType<undef>; // never
//type u = GetDefinedType<{ ext: undefined }>; // never
//type l = GetDefinedType<{ ext: string }>; // never
type v = GetDefinedType<{ po: string }, 'po'>; // string
*/



/*
type ExtToOutPut<CFG extends ReadFileConfig | undefined = undefined> = GetDefinedType<CFG> extends CFG ?
  GetDefinedType<CFG>['ext'] extends string ? GetDefinedType<CFG>['ext'] extends 'json' ? {} : never;
 */

export type ExtToOutPut<CFG extends ReadFileConfig = ReadFileConfig> =
  // if cfg is given
  GetDefinedType<CFG, 'ext'> extends never ? string :
    // if ext prop present
    CFG['ext'] extends 'json' ? {}
      : never;
/*
type aaa = ExtToOutPut<{}>; // string
type b = ExtToOutPut<{ ext: 'json' }>;  // {}
type a = ExtToOutPut; // never
//type c = ExtToOutPut<{ ext: 'wrongExt' }>;  // never
//type aa = ExtToOutPut<undefined>; // never
// type f = ExtToOutPut<{ext: 234}>;  // never
// type h = ExtToOutPut<{ext: 'sda'}>; // never
*/

export type ResolveFileResult<T> = { exports: T; path: string };
