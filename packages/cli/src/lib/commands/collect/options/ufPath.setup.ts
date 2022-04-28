import { RcJson } from '@push-based/user-flow/cli';
import { get as interactive } from '../../../core/options/interactive';
import { promptParam } from '../../../core/utils/prompt';
import { applyValidations, hasError, VALIDATORS } from '../../../core/utils/validation';
import { PROMPT_COLLECT_UF_PATH, DEFAULT_COLLECT_UF_PATH, ERROR_COLLECT_UF_PATH_REQUIRED } from './ufPath.constant';
import { mkdirSync, readdirSync } from 'fs';

export async function setupUfPath(
  config: RcJson,
): Promise<RcJson> {

  let ufPath = config?.collect?.ufPath;

  if (interactive()) {
    ufPath = await promptParam({
      message: PROMPT_COLLECT_UF_PATH,
      initial: ufPath || DEFAULT_COLLECT_UF_PATH,
      skip: !!ufPath
    });
  }

  const errors = applyValidations(ufPath, [
    VALIDATORS.required
  ]);
  if (hasError(errors)) {
    throw new Error(ERROR_COLLECT_UF_PATH_REQUIRED);
  }

  // DX create directory if it does ot exist
  try {
    readdirSync(ufPath);
  } catch (e) {
    mkdirSync(ufPath);
  }

  return {
    ...config,
    collect: { ...config?.collect, ufPath }
  };
}
