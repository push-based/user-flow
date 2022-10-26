import { ReadFileConfig } from '../../../commands/collect/utils/replay/types';

type IsDefined<T extends {} | undefined = undefined,
  K extends keyof T | undefined = undefined,
  > = T extends undefined ? false :
  K extends undefined ? true : K extends keyof T ? true : false;

/*
type ExtToOutPut<CFG extends ReadFileConfig | undefined = undefined> = IsDefined<CFG> extends CFG ?
  IsDefined<CFG>['ext'] extends string ? IsDefined<CFG>['ext'] extends 'json' ? {} : never;

 */
export type ExtToOutPut<CFG extends ReadFileConfig, R = undefined> =
// if cfg not given
  IsDefined<CFG, 'ext'> extends false ? string :
    // if ext prop present but undefined
    CFG['ext'] extends undefined ? string :
      // if ext prop present
      CFG['ext'] extends 'json' ? R extends undefined ? {} :
        // if type given
        R extends undefined ? {} : R :
        // else
        string;
/*
type undef = IsDefined;
type r = IsDefined; // false
type t = IsDefined<undef>; // true
type u = IsDefined<{ext: undefined}>; // true
type l = IsDefined<{ext: string}>; // true
type v = IsDefined<{po: string}, 'po'>; // true
// type p = IsDefined<{po: string}, 'o'>; // errors
// type i = ExtToOutPut; // error
type a = ExtToOutPut<{}>; // string
type b = ExtToOutPut<{ext: 'json'}>;  // {}
type c = ExtToOutPut<{ext: 'json'}, undefined>;  // {}
type d = ExtToOutPut<{ext: 'json'}, number>;  // number
// type f = ExtToOutPut<{ext: 234}>;  // errors
// type h = ExtToOutPut<{ext: 'sda'}>; // errors
*/



/*
const w = readFile('path') // string
const x = readFile('path', {}) // string
const y = readFile('path', {ext: 'json'}) // {}
const z = readFile<{ n: number }>('path', {ext: 'json'}) // {n: number}
*/
