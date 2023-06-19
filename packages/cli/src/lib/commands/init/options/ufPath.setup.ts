import {get as interactive} from '../../../global/options/interactive';
import {promptParam} from '../../../core/prompt';
import {
  applyValidations,
  hasError,
  VALIDATORS,
} from '../../../core/validation';
import {
  DEFAULT_COLLECT_UF_PATH,
  ERROR_COLLECT_UF_PATH_REQUIRED,
  PROMPT_COLLECT_UF_PATH,
} from '../../collect/options/ufPath.constant';
import {RcJson} from '../../../types';

export async function setupUfPath(config: RcJson): Promise<RcJson> {
  let ufPath = config?.collect?.ufPath;

  if (interactive()) {
    ufPath = await promptParam({
      message: PROMPT_COLLECT_UF_PATH,
      initial: ufPath || DEFAULT_COLLECT_UF_PATH,
      skip: !!ufPath,
    });
  }

  const errors = applyValidations(ufPath, [VALIDATORS.required]);
  if (hasError(errors)) {
    throw new Error(ERROR_COLLECT_UF_PATH_REQUIRED);
  }

  return {
    ...config,
    collect: {...config?.collect, ufPath},
  };
}
