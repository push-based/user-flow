import { UserFlowRcConfig } from './model';
import { get as interactive } from '../../core/options/interactive';
import { CONFIG_NAME, CONFIG_PATH, USER_FLOW_RESULT_DIR, USER_FLOWS_DIR } from './constants';
import { prompt } from 'enquirer';
import { join } from 'path';
import { get as getRcPath } from '../../core/options/rc';

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

  return {
    ...config,
    persist: {...config?.persist, outPath: suggestion}
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

  return {
    ...config,
    collect: {...config?.collect, ufPath: suggestion}
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
        skip: !!config?.collect?.url
      }
    ]);
    suggestion = url;
  }

  return {
    ...config,
    collect: {...config?.collect, url: suggestion}
  };
}
