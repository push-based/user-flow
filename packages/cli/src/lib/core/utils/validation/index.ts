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

const oneOf = (set: string[]) => (value: string) => {
  return (set.find(i => {
    console.log('i', i, value);
    return i === value
  }) === undefined) ? {
      oneOf: true
    }
    : null;
}
export const VALIDATORS = {
  required: (value: string) => value !== undefined && value !== '' ? null : { required: true },
  oneOf,
  allOf: (set: string[]) => (values: string[]) => {
    const _oneOf = oneOf(set);
    let errors = null
    // @ts-ignore
    values.forEach((value: string) => {
      const e = _oneOf(value);
      if (e) {
        errors = {
          allOf: true
        };
      }
    });
    return errors;
  }
};
