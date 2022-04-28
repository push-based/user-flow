import { RcJson } from '@push-based/user-flow/cli';
import { prompt } from 'enquirer';
import { get as interactive } from '../../../core/options/interactive';
import {
  DEFAULT_PERSIST_FORMAT,
  ERROR_PERSIST_FORMAT_REQUIRED,
  ERROR_PERSIST_FORMAT_WRONG,
  PROMPT_PERSIST_FORMAT
} from './format.constant';
import { promptParam } from '../../../core/utils/prompt';
import { applyValidations, hasError, VALIDATORS } from '../../../core/utils/validation';
import { REPORT_FORMAT_OPTIONS, REPORT_FORMAT_VALUES } from '../constats';

export async function setupFormat(
  config: RcJson
): Promise<RcJson> {
  let format: string[] = [];

  let cfgFormat: string[] = [];
  if (config?.persist?.format) {
    cfgFormat = Array.isArray(config.persist.format) ? config.persist.format : [config.persist.format];
  }

  if (cfgFormat.length === 0) {
    format = REPORT_FORMAT_VALUES;
  } else {
    format = cfgFormat;
  }

  if (interactive()) {

    format = cfgFormat.length === 0 ? await prompt<{ f: string[] }>([
      {
        type: 'multiselect',
        name: 'f',
        message: PROMPT_PERSIST_FORMAT,
        choices: REPORT_FORMAT_OPTIONS,
        // @NOTICE typing is broken here
        result(value: string): string {
          const values = value as any as string[];
          return values.map(name => REPORT_FORMAT_OPTIONS.find(i => i.name === name)?.value + '') as any as string;
        }
      }
    ]).then(({f}) => f) : cfgFormat ;

    if (format?.length === 0) {
      return setupFormat(config);
    }
  }

  // Validate
  const allOf = VALIDATORS.allOf(REPORT_FORMAT_VALUES);
  const errors = applyValidations(format, [
    VALIDATORS.required,
    allOf
  ]);

  if (hasError(errors)) {
    if(errors.required) {
      throw new Error(ERROR_PERSIST_FORMAT_REQUIRED);
    }

    if(errors.allOf) {
      throw new Error(ERROR_PERSIST_FORMAT_WRONG);
    }
  }

  return {
    ...config,
    persist: { ...config?.persist, format }
  };
}
/*

export async function ensureFormat(
  config: RcJson
): Promise<RcJson> {
  let suggestion: string[] = [];

  let cfgFormat: string[] = [];
  if (config?.persist?.format) {
    cfgFormat = Array.isArray(config.persist.format) ? config.persist.format : [config.persist.format];
  }

  if (cfgFormat.length === 0) {
    suggestion = REPORT_FORMAT_VALUES;
  } else {
    suggestion = cfgFormat;
  }
  if (interactive()) {
    outPath = await promptParam({
      message: ASK_PERSIST_OUT_PATH,
      initial: outPath || DEFAULT_PERSIST_OUT_PATH,
      skip: !!outPath
    });
  }
  if (interactive()) {

    const { format }: { format: string[] | undefined } = cfgFormat.length === 0 ? await prompt<{ format: string[] }>([
      {
        type: 'multiselect',
        name: 'format',
        message: PROMPT_PERSIST_FORMAT,
        choices: REPORT_FORMAT_OPTIONS,
        // @NOTICE typing is broken here
        result(value: string): string {
          const values = value as any as string[];
          return values.map(name => REPORT_FORMAT_OPTIONS.find(i => i.name === name)?.value + '') as any as string;
        }
      }
    ]) : { format: cfgFormat };

    suggestion = format;
    if (suggestion.length === 0) {
      return ensureFormat(config);
    }
  }

  // Validate
  const allOf = VALIDATORS.allOf(REPORT_FORMAT_VALUES);
  const errors = applyValidations(suggestion, [
    VALIDATORS.required,
    allOf
  ]);
  if (hasError(errors)) {
    if(errors.required) {
      throw new Error(ERROR_PERSIST_FORMAT_REQUIRED);
    }
    if(errors.allOf) {
      throw new Error(ERROR_PERSIST_FORMAT_WRONG);
    }
  }

  return {
    ...config,
    persist: { ...config?.persist, format: suggestion }
  };
}
*/
