import { UserFlowCliConfig } from './model';
import { getInteractive } from '../yargs/options';
import { CONFIG_NAME, CONFIG_PATH, USER_FLOW_RESULT_DIR, USER_FLOWS_DIR } from './constants';
import { prompt } from 'enquirer';
import { join } from 'path';
import { getCfgPath } from '../../options';

export async function ensureCfgPath(
): Promise<string> {
  let suggestion = CONFIG_PATH;
  if (getInteractive()) {
    const { cfgPath } = await prompt<{ cfgPath: string }>([
      {
        type: 'input',
        name: 'cfgPath',
        message: `What is the folder to your ${CONFIG_NAME} file?`,
        initial: suggestion,
        skip: !!getCfgPath()
      }
    ]);
    suggestion = cfgPath;
  }

  return join(suggestion, CONFIG_NAME);
}

export async function ensureOutPath(
  config: UserFlowCliConfig
): Promise<UserFlowCliConfig> {
  let suggestion = config?.persist?.outPath || USER_FLOW_RESULT_DIR;
  if (getInteractive()) {
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
  config: UserFlowCliConfig
): Promise<UserFlowCliConfig> {
  let suggestion = config?.collect?.ufPath || USER_FLOWS_DIR;
  if (getInteractive()) {
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
  config: UserFlowCliConfig
): Promise<UserFlowCliConfig> {
  let suggestion = config?.collect?.url || '';

  if (getInteractive()) {
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

