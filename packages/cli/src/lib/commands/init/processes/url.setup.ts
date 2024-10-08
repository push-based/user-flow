import { get as interactive } from '../../../global/options/interactive.js';
import { DEFAULT_COLLECT_URL, ERROR_COLLECT_URL_REQUIRED, PROMPT_COLLECT_URL } from '../../collect/options/url.constant.js';
import { promptParam } from '../../../core/prompt/prompt.js';
import { applyValidations, hasError, VALIDATORS } from '../../../core/validation/index.js';
import { RcJson } from '../../../types.js';

export async function setupUrl(
  config: RcJson
): Promise<RcJson> {

  let url = config?.collect?.url;

  if (interactive()) {
    url = await promptParam({
      message: PROMPT_COLLECT_URL,
      initial: url || DEFAULT_COLLECT_URL,
      skip: VALIDATORS.required(url) === null
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
