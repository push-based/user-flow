import {RcJson, RcJsonAsArgv} from "../../types.js";
import {getCollectCommandOptionsFromArgv} from "./utils/params.js";
import {logVerbose} from "../../core/loggin/index.js";
import {run} from "../../core/processing/behaviors.js";
import {collectRcJson} from "../init/processes/collect-rc-json.js";
import {startServerIfNeededAndExecute} from "./utils/serve-command.js";
import {collectReports} from "./processes/collect-reports.js";

export async function runCollectCommand(argv: RcJsonAsArgv) {
  const cfg = getCollectCommandOptionsFromArgv(argv);
  logVerbose('Collect options: ', cfg);
  await run([
    collectRcJson,
    (cfg: RcJson) =>
      startServerIfNeededAndExecute(() => collectReports(cfg)
          .then()
        , cfg.collect)
  ])(cfg);
}
