import { existsSync } from 'node:fs';

import { promptTo } from '../../../core/prompt.js';
import { concat, ifThenElse, tap } from '../../../core/processing/behaviors.js';
import { RcJson } from '../../../types.js';
import { logVerbose } from '../../../core/loggin/index.js';
import { readRcConfig, updateRcConfig } from '../../../global/rc-json/index.js';
import { setupUrl } from './url.setup.js';
import { setupUfPath } from './ufPath.setup.js';
import { setupFormat } from './format.setup.js';
import { setupOutPath } from './outPath.setup.js';

const OVERRIDE_RC_JSON_PROMPT = 'Do you want to override the existing rc file?';

const promptCollectRcJson = concat([setupUrl, setupUfPath, setupFormat, setupOutPath]);

function updateRcJsonFile(config: RcJson, rcPath: string) {
  logVerbose(config);
  updateRcConfig(config, rcPath);
}

function doesRcJsonAlreadyExist(rcPath: string): boolean {
  return existsSync(rcPath);
}

function generateRcJson(rcPath: string) {
  return concat([
    promptCollectRcJson,
    tap((rc) => updateRcJsonFile(rc, rcPath))
  ])
}

export function handleRcGeneration(rcPath: string) {
  return ifThenElse(
    () => doesRcJsonAlreadyExist(rcPath),
    promptTo({
      question: OVERRIDE_RC_JSON_PROMPT,
      acceptedCliProcess: generateRcJson(rcPath),
      deniedCliProcess: (rc) => ({ ...rc, ...readRcConfig(rcPath) })
    }),
    generateRcJson(rcPath)
  );
}
