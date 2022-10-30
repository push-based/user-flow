import { get as interactive } from '../../../global/options/interactive';
import { promptParam } from '../../../core/prompt';
import { applyValidations, hasError, VALIDATORS } from '../../../core/validation';
import { PROMPT_PERSIST_OUT_PATH, DEFAULT_PERSIST_OUT_PATH, ERROR_PERSIST_OUT_PATH_REQUIRED } from './outPath.constant';
import { mkdirSync, readdirSync } from 'fs';
import { RcJson } from '../../../core/rc-json/types';

export async function setupOutPath(
  config: RcJson
): Promise<RcJson> {

  let outPath = config?.persist?.outPath;

  if (interactive()) {
    outPath = await promptParam({
      message: PROMPT_PERSIST_OUT_PATH,
      initial: outPath || DEFAULT_PERSIST_OUT_PATH,
      skip: !!outPath
    });
  }

  const errors = applyValidations(outPath, [
    VALIDATORS.required,
  ]);
  if (hasError(errors)) {
    throw new Error(ERROR_PERSIST_OUT_PATH_REQUIRED);
  }

  // DX create directory if it does ot exist
  try {
    readdirSync(outPath);
  } catch (e) {
    mkdirSync(outPath);
  }

  return {
    ...config,
    persist: { ...config?.persist, outPath }
  };
}
