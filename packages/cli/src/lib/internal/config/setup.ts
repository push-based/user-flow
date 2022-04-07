import { UserFlowRcConfig } from './model';
import { get as interactive } from '../../core/options/interactive';
import { CONFIG_NAME, CONFIG_PATH, USER_FLOW_RESULT_DIR, USER_FLOWS_DIR } from './constants';
import { prompt } from 'enquirer';
import { join } from 'path';
import { get as getRcPath } from '../../core/options/rc';
import { REPORT_FORMAT_OPTIONS, REPORT_FORMAT_VALUES } from '../../commands/collect/constats';

export async function ensureOutPath(
  config: UserFlowRcConfig
): Promise<UserFlowRcConfig> {
  let suggestion = config?.persist?.outPath || USER_FLOW_RESULT_DIR;
  if (interactive()) {
    const { outPath } = await prompt<{ outPath: string }>([
      {
        type: 'input',
        name: 'outPath',
        message: 'What is the directory to store results in?',
        initial: suggestion,
        skip: !!config?.persist?.outPath
      }
    ]);
    suggestion = outPath;
  }

  // Check if path for output is given
  if (!suggestion) {
    throw new Error('Path to output folder is required. Either through the console as `--outPath` or in the `.user-flowrc.json`');
  }

  return {
    ...config,
    persist: { ...config?.persist, outPath: suggestion }
  };
}

export async function ensureUfPath(
  config: UserFlowRcConfig
): Promise<UserFlowRcConfig> {
  let suggestion = config?.collect?.ufPath || USER_FLOWS_DIR;
  if (interactive()) {
    const { ufPath } = await prompt<{ ufPath: string }>([
      {
        type: 'input',
        name: 'ufPath',
        message: 'What is the directory provides the user-flows?',
        initial: suggestion,
        skip: !!config?.collect?.ufPath
      }
    ]);
    suggestion = ufPath;
  }

  // Check if path to user-flows is given
  if (!suggestion) {
    throw new Error('Path to user flows is required. Either through the console as `--ufPath` or in the `.user-flowrc.json`');
  }

  return {
    ...config,
    collect: { ...config?.collect, ufPath: suggestion }
  };
}

export async function ensureUrl(
  config: UserFlowRcConfig
): Promise<UserFlowRcConfig> {

  let suggestion = config?.collect?.url || '';

  if (interactive()) {
    const { url } = await prompt<{ url: string }>([
      {
        type: 'input',
        name: 'url',
        message: 'What is the URL to run the user flows for?',
        initial: suggestion,
        skip: !!suggestion
      }
    ]);
    suggestion = url || suggestion;
  }

  // Validate
  // Check if url is given
  if (!suggestion) {
    throw new Error('URL is required. Either through the console as `--url` or in the `.user-flow.json`');
  }


  return {
    ...config,
    collect: { ...config?.collect, url: suggestion }
  };
}


export async function ensureFormat(
  config: UserFlowRcConfig
): Promise<UserFlowRcConfig> {
  let suggestion: string[] = [];
  const cfgFormat = config?.persist?.format;
  if (cfgFormat) {
    suggestion = Array.isArray(cfgFormat) ? cfgFormat : [cfgFormat];
  }

  if (Array.isArray(suggestion) && suggestion.length === 0) {
    suggestion = REPORT_FORMAT_VALUES;
  }


  if (interactive()) {

    const { format }: { format: string[] } = !suggestion?.length ? await prompt<{ format: string[] }>([
      {
        type: 'multiselect',
        name: 'format',
        message: 'What is the format of user-flows? (use ⬇/⬆ to navigate, and SPACE key to select)',
        choices: REPORT_FORMAT_OPTIONS,
        // @NOTICE typing is broken here
        result(value: string): string {
          const values = value as any as string[];
          return values.map(name => REPORT_FORMAT_OPTIONS.find(i => i.name === name)?.value + '') as any as string;
        }
      }
    ]) : { format: suggestion };

    suggestion = format;
    if (suggestion.length === 0) {
      return ensureFormat(config);
    }
  }

  // Validate
  // Check if format is given
  if (!suggestion) {
    throw new Error('format is required. Either through the console as `--format` or in the `.user-flow.json`');
  }

  suggestion.forEach((val) => {
    if(!REPORT_FORMAT_VALUES.find(i => i === val)) {
      throw new Error(`Wrong format "${val}" format has to be one of: ${REPORT_FORMAT_VALUES.join(', ')}`);
    }
  })

  return {
    ...config,
    persist: { ...config?.persist, format: suggestion }
  };
}
