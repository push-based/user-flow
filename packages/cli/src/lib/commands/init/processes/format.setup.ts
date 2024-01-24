import pkg from 'enquirer';

import { get as interactive } from '../../../global/options/interactive.js';
import {
  ERROR_PERSIST_FORMAT_REQUIRED,
  ERROR_PERSIST_FORMAT_WRONG,
  PROMPT_PERSIST_FORMAT
} from '../../collect/options/format.constant.js';
import { applyValidations, hasError, VALIDATORS } from '../../../core/validation/index.js';
import { REPORT_FORMAT_NAMES, REPORT_FORMAT_OPTIONS, REPORT_FORMAT_VALUES } from '../../collect/constants.js';
import { RcJson } from '../../../types.js';
import { ReportFormat } from '../../collect/options/types.js';
import { getEnvPreset } from '../../../pre-set.js';

const { prompt } = pkg;

export async function setupFormat(
  config: RcJson
): Promise<RcJson> {
  let format: ReportFormat[] = Array.isArray(config?.persist?.format) ? config.persist.format : [];

  if (interactive()) {
    const { f }: { f: ReportFormat[] } = format.length ? { f: format } : await prompt<{ f: ReportFormat[] }>([
      {
        type: 'multiselect',
        name: 'f',
        message: PROMPT_PERSIST_FORMAT,
        choices: REPORT_FORMAT_OPTIONS,
        initial: REPORT_FORMAT_VALUES.indexOf((getEnvPreset() as any).format[0]),
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
      throw new Error(ERROR_PERSIST_FORMAT_WRONG(errors.allOf.value));
    }
  }

  return {
    ...config,
    persist: { ...config?.persist, format }
  };
}
