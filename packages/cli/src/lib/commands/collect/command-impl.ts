import {RcJson, RcJsonAsArgv} from "../../types";
import {getCollectCommandOptionsFromArgv} from "./utils/params";
import {logVerbose} from "../../core/loggin";
import {run} from "../../core/processing/behaviors";
import {collectRcJson} from "../init/processes/collect-rc-json";
import {startServerIfNeededAndExecute} from "./utils/serve-command";
import {collectReports} from "./processes/collect-reports";

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
