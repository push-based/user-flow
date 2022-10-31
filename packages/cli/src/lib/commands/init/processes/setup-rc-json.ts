import { setupUrl } from '../../collect/options/url.setup';
import { setupUfPath } from '../../collect/options/ufPath.setup';
import { setupFormat } from '../../collect/options/format.setup';
import { setupOutPath } from '../../collect/options/outPath.setup';
import { get as getRcPath } from '../../../global/options/rc';
import { updateRcConfig } from '../../../core/rc-json';
import { logVerbose } from '../../../core/loggin';
import { RcJson } from '../../../core/rc-json/types';

export async function setupRcJson(cliCfg: RcJson): Promise<RcJson> {

   const config = {
    ...cliCfg,
    ...(await setupUrl(cliCfg)
        .then(setupUfPath)
        .then(setupFormat)
        .then(setupOutPath)
      // initial static defaults should be last as it takes user settings
    )
  };

  const rcPath = getRcPath();
  updateRcConfig(config, rcPath);

  logVerbose(config);

  return config;
}
