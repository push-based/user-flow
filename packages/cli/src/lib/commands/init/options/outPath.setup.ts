import {mkdirSync, readdirSync} from 'fs';
import {RcJson} from '../../../types';
import {get as interactive} from '../../../global/options/interactive';
import {promptParam} from '../../../core/prompt';
import {
  applyValidations,
  hasError,
  VALIDATORS,
} from '../../../core/validation';
import {
  PROMPT_PERSIST_OUT_PATH,
  DEFAULT_PERSIST_OUT_PATH,
  ERROR_PERSIST_OUT_PATH_REQUIRED,
} from '../../collect/options/outPath.constant';
import {logVerbose} from '../../../core/loggin';

export async function setupOutPath(config: RcJson): Promise<RcJson> {
  let outPath = config?.persist?.outPath;

  if (interactive()) {
    outPath = await promptParam({
      message: PROMPT_PERSIST_OUT_PATH,
      initial: outPath || DEFAULT_PERSIST_OUT_PATH,
      skip: !!outPath,
    });
  }

  const errors = applyValidations(outPath, [VALIDATORS.required]);
  if (hasError(errors)) {
    throw new Error(ERROR_PERSIST_OUT_PATH_REQUIRED);
  }

  // DX create directory if it does ot exist
  try {
    readdirSync(outPath);
  } catch (e) {
    mkdirSync(outPath, {recursive: true});
  }

  return {
    ...config,
    persist: {...config?.persist, outPath},
  };
}
