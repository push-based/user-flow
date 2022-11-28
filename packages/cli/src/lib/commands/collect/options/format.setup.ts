import { prompt } from 'enquirer';
import { get as interactive } from '../../../global/options/interactive';
import {
  ERROR_PERSIST_FORMAT_REQUIRED,
  ERROR_PERSIST_FORMAT_WRONG,
  PERSIST_FORMAT_HTML,
  PROMPT_PERSIST_FORMAT
} from './format.constant';
import { applyValidations, hasError, VALIDATORS } from '../../../core/validation';
import { REPORT_FORMAT_NAMES, REPORT_FORMAT_OPTIONS, REPORT_FORMAT_VALUES } from '../constants';
import { RcJson } from '../../../types';
import { ReportFormat } from './types';

export async function setupFormat(
  config: RcJson
): Promise<RcJson> {
  let format: ReportFormat[] = [];

  if (interactive()) {
    let initialFormat: ReportFormat =
      // take the provided formats from cli params or the rc file if given and convert it to a string (yes we cant use multiple initial values :( )
      Array.isArray(config?.persist?.format) ? config.persist.format[0] :
      typeof config.persist.format === 'string' ? config.persist.format :
        // if not use html format as a suggestion in the prompt
        PERSIST_FORMAT_HTML;

    const { f }: { f: ReportFormat[] | undefined } =  await prompt<{ f: ReportFormat[] }>([
      {
        type: 'multiselect',
        name: 'f',
        message: PROMPT_PERSIST_FORMAT,
        choices: REPORT_FORMAT_OPTIONS,
        initial: REPORT_FORMAT_VALUES.indexOf(initialFormat),
        // @NOTICE typing is broken here
        result(value: string) {
          const values = value as any as string[];
          return values.map((name: string) => REPORT_FORMAT_VALUES[REPORT_FORMAT_NAMES.indexOf(name)]) as any as string;
        },
        muliple: true
      }
    ]);

    format = f as ReportFormat[] || [];

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
    if (errors.required) {
      throw new Error(ERROR_PERSIST_FORMAT_REQUIRED);
    }

    if (errors.allOf) {
      console.log('errors.allOf: ', errors);
      throw new Error(ERROR_PERSIST_FORMAT_WRONG(errors.allOf.value));
    }
  }

  return {
    ...config,
    persist: { ...config?.persist, format }
  };
}
