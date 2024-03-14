import { setupUrl } from './url.setup';
import { setupUfPath } from './ufPath.setup';
import { setupFormat } from './format.setup';
import { setupOutPath } from './outPath.setup';
import { RcJson } from '../../../types';

export async function collectRcJson(cliCfg: RcJson): Promise<RcJson> {

   const config = {
    ...cliCfg,
    ...(await setupUrl(cliCfg)
        .then(setupUfPath)
        .then(setupFormat)
        .then(setupOutPath)
      // initial static defaults should be last as it takes user settings
    )
  };
  return config;
}
