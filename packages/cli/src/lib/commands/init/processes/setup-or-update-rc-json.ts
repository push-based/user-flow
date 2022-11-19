import { setupUrl } from '../../collect/options/url.setup';
import { setupUfPath } from '../../collect/options/ufPath.setup';
import { setupFormat } from '../../collect/options/format.setup';
import { setupOutPath } from '../../collect/options/outPath.setup';
import { updateRcConfig } from '../../../global/rc-json';
import { RcJson } from '../../../global/rc-json/types';
import { globalOptions } from '../../../global/options';


export async function setupOrUpdateRcJson(cliCfg: RcJson): Promise<RcJson> {

   const config = {
    ...cliCfg,
    ...(await setupUrl(cliCfg)
        .then(setupUfPath)
        .then(setupFormat)
        .then(setupOutPath)
      // initial static defaults should be last as it takes user settings
    )
  };

  const rcPath = globalOptions.getRcPath();
  updateRcConfig(config, rcPath);

  return config;
}
