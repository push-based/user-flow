import { Options, PositionalOptionsType } from 'yargs';
import { CoreOptions } from '../../core/options/types';
import { Param } from '../../core/options/rc.model';

export type Modify<T, R> = Omit<T, keyof R> & R;

export type YargsOptionTypes = PositionalOptionsType;
export type YargsOptionTypesToTsType<T> = T extends 'array' ? any[] :
                                            T extends 'count' | 'number' ? number :
                                              T extends 'string' ? string :
                                                T extends 'boolean' ? boolean :
                                                  T extends undefined ? undefined : never;
export type YargsArgvOptionFromParamsOptions<T extends { [opt: string]: Options }> = {[key in keyof T]: YargsOptionTypesToTsType<T[key]['type']>}
