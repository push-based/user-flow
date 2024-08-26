import { setupUrl } from './url.setup.js';
import { setupUfPath } from './ufPath.setup.js';
import { setupFormat } from './format.setup.js';
import { setupOutPath } from './outPath.setup.js';
import { RcJson } from '../../../types.js';

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
