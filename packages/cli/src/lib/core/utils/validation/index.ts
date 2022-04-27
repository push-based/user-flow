import { Error, ValidatorFn, ValidatorFnFactory } from './types';
import { ERROR_PERSIST_FORMAT_WRONG } from '../../../commands/collect/options/format.constant';

export function applyValidations<T>(value: T, validators: ValidatorFn[]): Error {
  return validators.reduce((errors, validator) => {
    return { ...errors, ...(validator(value) || {}) };
  }, {});
}

export function hasError(errors: Error): boolean {
  return Object.entries(errors).length > 0;
}

const oneOf = (set: string[]) => (value: string) => (!set.find(i => i === value)) ? {
    oneOf: true
  }
  : null;
export const VALIDATORS = {
  required: (value: string) => value !== undefined && value !== '' ? null : { required: true },
  oneOf,
  allOf: (set: string[]) => (values: string[]) => {
    const _oneOf = oneOf(set);
    // @ts-ignore
    values.forEach((value: string) => {
      if (_oneOf(value)) {
        return {
          allOf: true
        };
      }
    });
    return null;
  }
};
