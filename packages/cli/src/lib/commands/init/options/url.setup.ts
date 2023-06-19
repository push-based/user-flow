import {get as interactive} from '../../../global/options/interactive';
import {DEFAULT_COLLECT_URL, ERROR_COLLECT_URL_REQUIRED, PROMPT_COLLECT_URL,} from '../../collect/options/url.constant';
import {promptParam} from '../../../core/prompt';
import {applyValidations, hasError, VALIDATORS,} from '../../../core/validation';
import {RcJson} from '../../../types';

export async function setupUrl(config: RcJson): Promise<RcJson> {
  let url = config?.collect?.url;

  if (interactive()) {
    url = await promptParam({
      message: PROMPT_COLLECT_URL,
      initial: url || DEFAULT_COLLECT_URL,
      skip: VALIDATORS.required(url) === null,
    });
  }

  const errors = applyValidations(url, [VALIDATORS.required]);
  if (hasError(errors)) {
    throw new Error(ERROR_COLLECT_URL_REQUIRED);
  }

  return {
    ...config,
    collect: { ...config?.collect, url },
  };
}
