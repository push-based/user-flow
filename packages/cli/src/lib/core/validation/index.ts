import {Error, ValidatorFn} from './types.js';

export function applyValidations<T>(value: T, validators: ValidatorFn[]): Error {
  const errors: Error = {};
  for (const validator of validators) {
    Object.assign(errors, validator(value));
  }
  return errors;
}

export function hasError(errors: Error): boolean {
  return Object.entries(errors).length > 0;
}

const oneOf = (set: string[]) => (value: string) => {
  return (set.find(i => {
    return i === value
  }) === undefined) ? {
      oneOf: { value }
    }
    : null;
}
export const VALIDATORS = {
  required: (value: string) => value !== undefined && value !== '' ? null : { required: true },
  oneOf,
  allOf: (set: string[]) => (values: string[]) => {
    const _oneOf = oneOf(set);
    let errors: { allOf: { value: string } } | null = null
    values.forEach((value: string) => {
      const e = _oneOf(value);
      if (e) {
        errors = {
          allOf: { value },
        };
      }
    });
    return errors;
  }
};
