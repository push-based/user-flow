import { setupUrl } from '../options/url.setup.js';
import { setupUfPath } from '../options/ufPath.setup.js';
import { setupFormat } from '../options/format.setup.js';
import { setupOutPath } from '../options/outPath.setup.js';
import { RcJson } from '../../../types.js';

export async function collectRcJson(cliCfg: RcJson): Promise<RcJson> {
  return {
    ...cliCfg,
    ...(await setupUrl(cliCfg)
        .then(setupUfPath)
        .then(setupFormat)
        .then(setupOutPath)
      // initial static defaults should be last as it takes user settings
    )
  };
}
