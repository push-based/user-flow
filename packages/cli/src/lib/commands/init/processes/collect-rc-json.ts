import { setupUrl } from '../options/url.setup';
import { setupUfPath } from '../options/ufPath.setup';
import { setupFormat } from '../options/format.setup';
import { setupOutPath } from '../options/outPath.setup';
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
