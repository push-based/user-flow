import { RcJson } from '@push-based/user-flow/cli';
import { get as interactive } from '../../../core/options/interactive';
import { DEFAULT_COLLECT_URL, ERROR_COLLECT_URL_REQUIRED, PROMPT_COLLECT_URL } from './url.constant';
import { promptParam } from '../../../core/utils/prompt';
import { applyValidations, hasError, VALIDATORS } from '../../../core/utils/validation';

export async function setupUrl(
  config: RcJson
): Promise<RcJson> {

  let url = config?.collect?.url;

  if (interactive()) {
    url = await promptParam({
      message: PROMPT_COLLECT_URL,
      initial: url || DEFAULT_COLLECT_URL,
      skip: url !== ''
    });
  }

  const errors = applyValidations(url, [
    VALIDATORS.required
  ]);
  if (hasError(errors)) {
    throw new Error(ERROR_COLLECT_URL_REQUIRED);
  }

  return {
    ...config,
    collect: { ...config?.collect, url }
  };
}
